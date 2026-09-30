Generated with discovered.json: 0x26d7683ec1c27463bc66fb76ed502c2927111948

# Diff at Tue, 22 Sep 2026 15:13:21 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2e9174e8edc4a3b646f958a1d6e0d4360abec40d block: 1789471922
- current timestamp: 1790089928

## Description

Upgraded all Interfold contracts across the board to unverified implementations. We went ahead and verified them for you on etherscan. The protocol was shortly unpaused to test it and then re-paused.

Changes look like incremental small in-prod development of their protocol. Read on for detailed AI change descriptions and diff links.

- https://disco.l2beat.com/diff/eth:0xA7e1f2693b3b5038e505396Dbd21d6c26ECa8aA2/eth:0xad5C8CA4bd0d086272039400Fa532019A920dD43 Interfold: the BFV parameter set, committee sizes and thresholds become compiled-in constants of the ActiveCryptoConfig library (removing the owner-settable committee thresholds and param-set registry), with the lifecycle and pricing logic in external libraries.
- https://disco.l2beat.com/diff/eth:0xFff476751949a7e1B784b5c88648833c1e8dD69c/eth:0xD9A3224D829a4ac8b55A75C539fD447AC4B05Bf2 CiphernodeRegistry: exposes the randomness circuit-breaker state (randomnessDegraded) and relinks the sortition library.
- https://disco.l2beat.com/diff/eth:0xd89D3fE1b53eF95111c0E68A8CeFDfd20EcCA53a/eth:0x290d5156AAa23cbEb458751A73688d2375220Ad2 BondingRegistry: identical source redeployed against freshly deployed bonding libraries.
- https://disco.l2beat.com/diff/eth:0xE506249Ba5ede04A68b702b92704a0b88054f86A/eth:0x7C85D6C39EdAfCE6398fF1299b2a1eaBa0645870 E3RefundManager: drops the MAX_PROTOCOL_BPS constant and relinks the refund-claim library.
- https://disco.l2beat.com/diff/eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9/eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4 SlashingManager: new deployment authorized in the BondingRegistry in place of the old manager, which was deauthorized; the DAO holds its default-admin and governance roles.
- https://disco.l2beat.com/diff/eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712/eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00 RandomnessProvider: new Chainlink VRF v2.5 consumer on a new subscription, with the CiphernodeRegistry as its only requester and the DAO as owner.
- https://disco.l2beat.com/diff/eth:0xBA1854fDA7A5c127606572e43Dc7B37b7A15bdFf/eth:0x7CD10057c25674bd5666A9deEE3193f1b29563d1 BFV public-key verifier: single-committee wrapper replaced by a router over three per-committee-size verifiers with new Honk circuit verifiers and verification keys.
- https://disco.l2beat.com/diff/eth:0xf143b969ea481Ccf251194D15F82007C67AABc53/eth:0xA66CAb7AE230698b2a9ee1E0E967BaD4651FeEa7 BFV decryption verifier: single-committee wrapper replaced by a router over three per-committee-size verifiers with new Honk circuit verifiers and verification keys.
- https://disco.l2beat.com/diff/eth:0x40a18Fc27ac4a4d86fA70385c6814e453b6BFF2c/eth:0x80D217d3b2e16fF2ecc178cC75655C773895c549 Ciphertext verifier: same RISC Zero wrapper redeployed with a new guest image ID against a new RISC Zero verifier.

## Watched changes

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits.
      values.$implementation:
-        "eth:0xd89D3fE1b53eF95111c0E68A8CeFDfd20EcCA53a"
+        "eth:0x290d5156AAa23cbEb458751A73688d2375220Ad2"
      values.$pastUpgrades.3:
+        ["2026-09-18T13:15:47.000Z","0x975b5104729480bdf914304ce81726041e27450580fab4cd2f2750b7f0848047",["eth:0x290d5156AAa23cbEb458751A73688d2375220Ad2"]]
      values.$upgradeCount:
-        3
+        4
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.21:
+        "eth:0xc6E48712E56F6E9548c54a0A983eBe992eFA26Bd"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.22:
+        "eth:0x1fD2b3d4a9f4Aeb62877cab9dF70A5a6e976b118"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.23:
+        "eth:0x9EC16384b956D7B2A71284711FD32d156e6b33c6"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.24:
+        "eth:0xd2b46ceC7b4d8046eF2D7bCb32aF3220Ef7bc1dd"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.25:
+        "eth:0xd3336047DCf4d7C7393b3BF5Fa47A31478C22d47"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.26:
+        "eth:0xd698bC33a4A98a019881c6e2664f1dAc62c4B3B5"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.27:
+        "eth:0x76f3491D36138450F957b03F657dDa258Ad4c0E7"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.28:
+        "eth:0x2048E0750655298E628155Ca5024F0b30D896e51"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.29:
+        "eth:0x69760AF47771F8F763B5E3cb88601C197b0ee235"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.30:
+        "eth:0xAF92b142F15eb873f7D1d9F05c8c9b1855698249"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.31:
+        "eth:0xBf11E6B5be2ff90CDC6860BAe7941e44aa52DEc3"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.32:
+        "eth:0x8DEeF8799921D549BAC469aD6d37912DBeB2432a"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.33:
+        "eth:0xfbe2eEB95eb083F89bBb1C9c384328d9cfE43d47"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.34:
+        "eth:0x3394971Ee0cb5bc6336F8C36bc8807CDAA8BB017"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.35:
+        "eth:0x9D129a1733ab0f56460cCCfdC807C797b5a1a53c"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.36:
+        "eth:0x160AC642aC8Ef8bd4491d22A46772B773960B4b5"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.37:
+        "eth:0x0dB1A5DA3481Ce66B81FC7A48dD982FA0AcFCC99"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.38:
+        "eth:0x4429dB606a7c476762E4c7003963603f97a3C031"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.39:
+        "eth:0xd99672d25e783F245D3E0183581fAae0c154B8b6"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.40:
+        "eth:0x62b2dF039198096259F8dc619cE5E79507806A00"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.41:
+        "eth:0x5BA3ef7913D6dD46e2b4EBd8A05eF4615ae8Be5B"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.42:
+        "eth:0x780c1bB4Abc6F4324813e58a52C9d2FEF055ef78"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.43:
+        "eth:0xfC16c9513bB6b4FE7978723bB2468E99D8A34d70"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.44:
+        "eth:0x9aCc89CCD297064779C4e0f1c353079975C731b6"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.45:
+        "eth:0xFD97D727CdF9867944de554E45499D5162bDBfAc"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.46:
+        "eth:0x5cFc8841C3fBb3CA8dCb2BfBD3a39a98dE5B942a"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.47:
+        "eth:0xcD34cF9C66F524c91A14e67D3eF68157f809Abf7"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.48:
+        "eth:0x6B035c1b0B099555284C8676e48e2C3CB8b3d4B0"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.49:
+        "eth:0x86FBE1027577A343c1C9DcCAEc470d2B613cB347"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.50:
+        "eth:0x2358424b1E347f1FAADB7F54C5eB57eeA3A2738d"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.51:
+        "eth:0xFcEdB9Af33A338A80DA84785023BfDb988CaAd6E"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.52:
+        "eth:0x7E94eEd05e81679F69dA44157a45F0528DA9Ce66"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.53:
+        "eth:0xFF79709339F5dBCA606c8b9D4940390d61cB4B29"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.54:
+        "eth:0x2A2Df1e79ec3be51c0B050175E3D897e3911dC42"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.55:
+        "eth:0xDa1D20efb36e7F3bb47CEDbF471feB099051e717"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.56:
+        "eth:0x58C40cEC1ebAc2e383B5091ed47fa719a29f00A4"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.57:
+        "eth:0x5Fb0854aB8fb2810b80d3DE276b3107a9e5281b1"
+++ description: Contracts currently authorized to debit ticket collateral and FOLD bonds, ban operators and manage slash-routing state.
      values.authorizedSlashingManagerAt.0:
-        "eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9"
+        "eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4"
+++ description: Number of operators whose active status is valid under the current eligibility-configuration version. Unlike activeOperators, this drops immediately when the version is bumped, so it is the signal for a mass invalidation.
      values.numActiveOperators:
-        19
+        56
      values.slashingManager:
-        "eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9"
+        "eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4"
      implementationNames.eth:0xd89D3fE1b53eF95111c0E68A8CeFDfd20EcCA53a:
-        "BondingRegistry"
      implementationNames.eth:0x290d5156AAa23cbEb458751A73688d2375220Ad2:
+        "BondingRegistry"
    }
```

```diff
    contract E3RefundManager (eth:0x1940eF168f4E0B3dA24BEca539856684793B0F6e) [interfold/E3RefundManager] {
    +++ description: Upgradeable accounting contract that snapshots the refund policy for each E3 and distributes request fees and routed slashed funds between the requester, honest committee members, protocol treasury and reserve.
      sourceHashes.1:
-        "0x9a5f2a5ae202a5a570f526127420fdcc919af6dc90b48df309bb1b7cfaa9ec7d"
+        "0xd28721fb9cf579c4c833f3afdb1da2f3bc70caa34698f245340fc5f4e44376cf"
      values.$implementation:
-        "eth:0xE506249Ba5ede04A68b702b92704a0b88054f86A"
+        "eth:0x7C85D6C39EdAfCE6398fF1299b2a1eaBa0645870"
      values.$pastUpgrades.1:
+        ["2026-09-18T13:15:47.000Z","0x975b5104729480bdf914304ce81726041e27450580fab4cd2f2750b7f0848047",["eth:0x7C85D6C39EdAfCE6398fF1299b2a1eaBa0645870"]]
      values.$upgradeCount:
-        1
+        2
      implementationNames.eth:0xE506249Ba5ede04A68b702b92704a0b88054f86A:
-        "E3RefundManager"
      implementationNames.eth:0x7C85D6C39EdAfCE6398fF1299b2a1eaBa0645870:
+        "E3RefundManager"
    }
```

```diff
    contract CrispTokenVoting (eth:0x197be4E09614285Abb4b74b672377c404FD44d54) [interfold/CrispVoting] {
    +++ description: Upgradeable Aragon voting plugin from the interfold-crisp plugin repo. Votes are cast as encrypted CRISP ballots and tallied through an Interfold E3, so individual votes stay confidential to the ciphernode committee threshold. Used as the token-holder voting stage of the Interfold Protocol Proposal path.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "EIP1967 proxy"
      template:
+        "interfold/CrispVoting"
      sourceHashes:
+        ["0xe38a79e097149d54c3a08cd674ba5ffe929d1e8fc3c0c6c436ab5df7efcb1858","0xecff8c39cdcec83b40ee88c043bf1143a72e9b910e8114977165e96405acc736"]
      description:
+        "Upgradeable Aragon voting plugin from the interfold-crisp plugin repo. Votes are cast as encrypted CRISP ballots and tallied through an Interfold E3, so individual votes stay confidential to the ciphernode committee threshold. Used as the token-holder voting stage of the Interfold Protocol Proposal path."
      deployerAddress:
+        "eth:0x34655732dB9BBfA627021D18d786EfF7Bde211F7"
      sinceTimestamp:
+        1789746143
      sinceBlock:
+        26005353
      values:
+        {"$admin":"eth:0x0000000000000000000000000000000000000000","$implementation":"eth:0xb3d51BDe9cB8401cE9C630448Da2619279eF97DA","$pastUpgrades":[["2026-09-18T15:42:23.000Z","0x14398bbef18acce0287611f2ca745ea56d594f1554d5fc868aeadbabcb220c48",["eth:0xb3d51BDe9cB8401cE9C630448Da2619279eF97DA"]]],"$upgradeCount":1,"availabilityFinalizationWindow":10800,"CREATE_PROPOSAL_PERMISSION_ID":"0x8c433a4cd6b51969eca37f974940894297b9fcf4b282a213fea5cd8f85289c90","customProposalParamsABI":"(uint256 allowFailureMap)","dao":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","earliestVotingStart":1790115719,"getCurrentTargetConfig":{"target":"eth:0x56ce4D8006292Abf418291FaE813C1E3769240A4","operation":1},"getE3Settings":[2,1,"0x7b226e616d65223a225249534330222c22706172616c6c656c223a66616c73652c2262617463685f73697a65223a347d"],"getMetadata":"0x","getTargetConfig":{"target":"eth:0x56ce4D8006292Abf418291FaE813C1E3769240A4","operation":1},"getVotingToken":"eth:0x028deEA644258c78b1B5B2eacF469F5D781Fb43E","implementation":"eth:0xb3d51BDe9cB8401cE9C630448Da2619279eF97DA","interfold":"eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715","interfoldFeeToken":"eth:0xdC035D45d973E3EC169d2276DDab16f1e407384F","MANAGER_PERMISSION_ID":"0x2cf8b99554b63927353c04c2e1cee7fe05352aeb3c52d2576a2f7fd7fb8e180a","minDuration":432000,"minParticipation":2,"minProposerVotingPower":0,"minVoterVotingPower":1,"pluginType":0,"protocolVersion":[1,4,0],"SET_METADATA_PERMISSION_ID":"0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b","SET_TARGET_CONFIG_PERMISSION_ID":"0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7","supportThreshold":51,"UPGRADE_PLUGIN_PERMISSION_ID":"0x821b6e3a557148015a918c89e5d092e878a69854a2d1a410635f771bd5a8a3f5"}
      fieldMeta:
+        {"dao":{"description":"Aragon DAO whose permission manager controls the plugin's settings, target and upgrades."},"interfold":{"description":"E3 coordinator that runs the encrypted tally."},"interfoldFeeToken":{"description":"ERC-20 in which E3 request fees for each vote are paid to Interfold. Its own protocol is outside this discovery perimeter."},"getVotingToken":{"description":"IVotes source used for proposal snapshots and vote weights."},"getE3Settings":{"description":"Committee size class, BFV parameter set and program parameters requested for each vote's E3.","type":"RISK_PARAMETER"},"supportThreshold":{"description":"Required yes-vote share for a proposal to pass, in the plugin's ratio base.","type":"RISK_PARAMETER"},"minParticipation":{"description":"Minimum participating voting power relative to the snapshotted total supply, in the plugin's ratio base.","type":"RISK_PARAMETER"},"minDuration":{"description":"Minimum voting duration in seconds.","type":"RISK_PARAMETER"},"minProposerVotingPower":{"description":"Minimum voting power the creator must hold at the proposal snapshot.","type":"RISK_PARAMETER"},"minVoterVotingPower":{"description":"Minimum voting power required to cast a ballot.","type":"RISK_PARAMETER"},"availabilityFinalizationWindow":{"description":"Time after voting ends reserved for finalizing ballot data availability before the tally.","type":"RISK_PARAMETER"},"getTargetConfig":{"description":"Execution target and call operation for passed votes.","type":"CODE_CHANGE"}}
      implementationNames:
+        {"eth:0x197be4E09614285Abb4b74b672377c404FD44d54":"ERC1967Proxy","eth:0xb3d51BDe9cB8401cE9C630448Da2619279eF97DA":"CrispVoting"}
      category:
+        {"name":"Governance","priority":3}
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change multisig plugin target execution configuration.","role":".multisigTargetConfigAdmins"}]
    }
```

```diff
    contract Interfold (eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715) [interfold/Interfold] {
    +++ description: Coordinator for Encrypted Execution Environments (E3s). It accepts requests for allowlisted programs, selects a ciphernode committee, snapshots the configured proof system, and verifies the encrypted result and threshold decryption before publishing plaintext output.
      sourceHashes.1:
-        "0xd3737346baa5d40f73aea8a15668e65fc210c6fbb56ddf2c8d8f6a0386d0a6f9"
+        "0x2df58a27c4061f9543d01a5d32f6f88aefd401d25a50c1c574ecae4a01236915"
      values.$implementation:
-        "eth:0xA7e1f2693b3b5038e505396Dbd21d6c26ECa8aA2"
+        "eth:0xad5C8CA4bd0d086272039400Fa532019A920dD43"
      values.$pastUpgrades.2:
+        ["2026-09-18T13:15:47.000Z","0x975b5104729480bdf914304ce81726041e27450580fab4cd2f2750b7f0848047",["eth:0xad5C8CA4bd0d086272039400Fa532019A920dD43"]]
      values.$upgradeCount:
-        2
+        3
+++ description: Compiled-in identifier of the BFV parameter set and circuit configuration accepted for new requests. Changing it requires a new implementation.
+++ severity: HIGH
      values.activeCryptoConfigId:
-        "0x04f3677e73b0f5066d6caf5cbd92e3fb2e38338edaf5cfc971ab28f7b684da78"
+        "0xd9c86e581f8291ffb5b63595600e8d096ed30b16e2e0a6634a76c22b1f58fb4e"
+++ description: Verifier used for the encrypted computation output of future BFV E3s.
+++ severity: HIGH
      values.bfvCiphertextVerifier:
-        "eth:0x40a18Fc27ac4a4d86fA70385c6814e453b6BFF2c"
+        "eth:0x80D217d3b2e16fF2ecc178cC75655C773895c549"
+++ description: Verifier used for BFV threshold-decryption proofs for future E3s.
+++ severity: HIGH
      values.bfvDecryptionVerifier:
-        "eth:0xf143b969ea481Ccf251194D15F82007C67AABc53"
+        "eth:0xA66CAb7AE230698b2a9ee1E0E967BaD4651FeEa7"
+++ description: Verifier used for BFV distributed-key-generation proofs for future E3s.
+++ severity: HIGH
      values.bfvPkVerifier:
-        "eth:0xBA1854fDA7A5c127606572e43Dc7B37b7A15bdFf"
+        "eth:0x7CD10057c25674bd5666A9deEE3193f1b29563d1"
      values.getPricingConfig.minCommitteeSize:
-        3
+        19
+++ description: Committee size of the compiled-in active BFV configuration; the matching decryption threshold and assumed-honest count are constants of the ActiveCryptoConfig library in the verified source and are not readable onchain.
+++ severity: HIGH
      values.MAX_COMMITTEE_SIZE:
-        3
+        19
+++ description: E3 application contracts permanently allowlisted by governance. Registration cannot be revoked in the current implementation.
      values.registeredE3Programs.2:
+        "eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3"
      values.slashingManager:
-        "eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9"
+        "eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4"
      implementationNames.eth:0xA7e1f2693b3b5038e505396Dbd21d6c26ECa8aA2:
-        "Interfold"
      implementationNames.eth:0xad5C8CA4bd0d086272039400Fa532019A920dD43:
+        "Interfold"
    }
```

```diff
    contract ProtocolProposalProcessor (eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB) [interfold/StagedProposalProcessor] {
    +++ description: Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "EIP1967 proxy"
      template:
+        "interfold/StagedProposalProcessor"
      sourceHashes:
+        ["0xe38a79e097149d54c3a08cd674ba5ffe929d1e8fc3c0c6c436ab5df7efcb1858","0x001b18ae4604ab644ca37dc856974c6b97fb66cfbff5f17ade7109694d1ee295"]
      description:
+        "Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows."
      deployerAddress:
+        "eth:0x34655732dB9BBfA627021D18d786EfF7Bde211F7"
      sinceTimestamp:
+        1789739891
      sinceBlock:
+        26004832
      values:
+        {"$admin":"eth:0x0000000000000000000000000000000000000000","$implementation":"eth:0xCB895791C84484530d9fC9f68652b9bCC9D5288d","$pastUpgrades":[["2026-09-18T13:58:11.000Z","0xfd3ee0f421e7a4249d48359bf6219ae42c60e0898e0b907887c4c314bb4154a6",["eth:0xCB895791C84484530d9fC9f68652b9bCC9D5288d"]]],"$upgradeCount":1,"currentStages":[[[["eth:0x197be4E09614285Abb4b74b672377c404FD44d54",false,true,1]],1036800,0,432000,1,0,false,false],[[["eth:0x8B43b2852fc5031D01DDfCDF702973D93A2FF593",true,false,1]],432000,0,0,1,0,false,false]],"customProposalParamsABI":"(bytes[][] subBodiesCustomProposalParamsABI)","dao":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","getCurrentConfigIndex":1,"getCurrentTargetConfig":{"target":"eth:0x0000000000000000000000000000000000000000","operation":0},"getMetadata":"0x697066733a2f2f516d534559616f58524c753275743261426b4342353237634c5156356f77314a55696a3448786b52595842643259","getTargetConfig":{"target":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","operation":0},"getTrustedForwarder":"eth:0x0000000000000000000000000000000000000000","implementation":"eth:0xCB895791C84484530d9fC9f68652b9bCC9D5288d","pluginType":0,"protocolVersion":[1,4,0],"SET_METADATA_PERMISSION_ID":"0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b","SET_TARGET_CONFIG_PERMISSION_ID":"0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7","UPGRADE_PLUGIN_PERMISSION_ID":"0x821b6e3a557148015a918c89e5d092e878a69854a2d1a410635f771bd5a8a3f5"}
      fieldMeta:
+        {"dao":{"description":"Aragon DAO whose permission manager controls proposal creation, configuration, advancement and upgrades."},"currentStages":{"description":"Latest proposal-stage configuration reconstructed from events, including voting bodies, approval and veto thresholds, timing windows, and edit/cancel flags.","type":"RISK_PARAMETER"},"getCurrentConfigIndex":{"description":"Index of the stage configuration used by newly created proposals. Existing proposals retain their earlier snapshot."},"getCurrentTargetConfig":{"description":"Stored target and call operation for passed proposal actions. A zero target resolves to the DAO; delegatecall changes the security context.","type":"CODE_CHANGE"},"getTrustedForwarder":{"description":"Address trusted to append the effective caller to proposal transactions."}}
      implementationNames:
+        {"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB":"ERC1967Proxy","eth:0xCB895791C84484530d9fC9f68652b9bCC9D5288d":"StagedProposalProcessor"}
      category:
+        {"name":"Governance","priority":3}
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F","description":"replace collateral assets and protocol dependencies; change bond, ticket, eligibility and exit parameters; authorize slashing managers and reward distributors; clear bans from old managers; withdraw slashed funds; and replace the slashed-funds treasury.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x1940eF168f4E0B3dA24BEca539856684793B0F6e","description":"change the work-allocation split, coordinator and treasury without an onchain delay.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715","description":"pause or unpause new requests; replace the registry, bonding, slashing, refund and node-release dependencies; allow fee assets and E3 programs; replace proof verifiers; and change pricing (including the flat randomness fee), timeouts, parameter sets and committee thresholds without an onchain delay.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change multisig plugin target execution configuration.","role":".multisigTargetConfigAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change multisig plugin target execution configuration.","role":".multisigTargetConfigAdmins"},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change support, participation, duration, proposer-power and minimum-approval requirements for future votes.","role":".tokenVotingSettingsManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change the settings of the unverified CRISP token-voting plugin used as the IPP voting stage.","role":".crispVotingSettingsManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"grant and revoke permissions in the DAO.","role":".daoRootHolders","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"open a CRISP token vote using the caller-supplied proposal payload.","role":".crispVotingProposalCreators"},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect calls made by the Admin plugin to another executor or target.","role":".adminTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed CRISP vote actions to another executor or target.","role":".crispVotingTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed Interfold Protocol Proposal actions to another executor or target.","role":".ippTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed proposal actions to another executor or target.","role":".sppTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed vote actions to another executor or target.","role":".tokenVotingTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to IPP proposal transactions.","role":".ippTrustedForwarderManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to proposal transactions.","role":".sppTrustedForwarderManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate creation of Interfold Protocol Proposals.","role":".ippConditionRuleManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate public creation of staged proposals.","role":".conditionRuleManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future Interfold Protocol Proposals.","role":".ippStageManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future public proposals.","role":".sppStageManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x847A22303639017bcDB7F7E49EEa4a4629c1169f","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A","description":"raise the required ciphernode protocol version and node generation, which instantly invalidates every operator's cached eligibility until they attest the new release. The requirement can only increase, and only while new E3 requests are paused and no E3s or committees are active.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"change cooldowns and exit fees and upgrade the voting-escrow exit queue.","role":".exitQueueAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"change multisig plugin settings.","role":".multisigSettingsAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"change multisig plugin target execution configuration.","role":".multisigTargetConfigAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"change transfer whitelist settings and upgrade the voting-lock NFT.","role":".lockAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"change voting epochs and upgrade the voting-escrow Clock.","role":".clockAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"change voting-power curve parameters and upgrade the Curve implementation.","role":".curveAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"complete queued voting-escrow withdrawals.","role":".exitQueueWithdrawers","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"grant and revoke permissions in the voting-escrow DAO.","role":".veDaoRootHolders","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"manage gauge metadata and the voting-power update hook.","role":".gaugeAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"pause and unpause voting-escrow operations.","role":".votingEscrowPausers","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"pause the escrow voting-power adapter, manage delegation settings and upgrade its implementation.","role":".votesAdapterAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"replace voting-power dependencies, change minimum deposits and split rules, and upgrade VotingEscrow.","role":".votingEscrowAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"sweep unaccounted tokens and NFTs from VotingEscrow.","role":".votingEscrowSweepers","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","description":"update delegated voting power through the escrow voting adapter.","role":".delegationTokenManagers","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0xC0B5b49a3949eC4B520eF21BaCFE16e3695F3B5D","description":"schedule and activate a registry replacement after one day when all ticket liabilities are zero, and rescue ERC-20s other than the underlying sUSDS.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"interact","from":"eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7","description":"replace the coordinator, bonding, slashing and randomness-provider dependencies; add or remove ciphernodes; change the sortition window and randomness timeout; and update the DKG verifier and accusation-vote validity parameters. DKG-verifier replacement and risk-reducing accusation-window changes use a two-day propose/commit delay, while other changes are immediate. Randomness settings can only change while new requests are paused and no committees are outstanding.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F","role":"admin","via":[{"address":"eth:0xf1511Fc32abf7Bd3a3213ddCF08C07259b53972b"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x1940eF168f4E0B3dA24BEca539856684793B0F6e","role":"admin","via":[{"address":"eth:0x9393573a9EF85c9A37d91E32702a340084A48b6E"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715","role":"admin","via":[{"address":"eth:0xB3985D7fF844FA0F5E0aaC5feb5DD8BE15e88580"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","role":".daoUpgraders","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".clockAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".curveAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".exitQueueAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".gaugeUpgraders","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".lockAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".veDaoUpgraders","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".votesAdapterAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B","role":".votingEscrowAdmins","via":[{"address":"eth:0x9e9617418DFb9E4daD00E2D1e8f21e214901989B"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]},{"permission":"upgrade","from":"eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7","role":"admin","via":[{"address":"eth:0x2DFb93A8C3cE68Be3d8129479d7870646d89aDa7"},{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}]
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"execute arbitrary calls from the DAO, including calls to protocol owners and ProxyAdmins.","role":".daoExecutors"}]
    }
```

```diff
-   Status: DELETED
    contract DecryptionAggregatorVerifier (eth:0x53Fc34b412E16A1aE05A86934b821F82ca2a10da) [interfold/DecryptionAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV threshold-decryption aggregation circuit.
```

```diff
    contract InterfoldSafeA (eth:0x5429D8c7fD14023f3c414126F94BbE25A05fC018) [GnosisSafe] {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change the settings of the unverified CRISP token-voting plugin used as the IPP voting stage.","role":".crispVotingSettingsManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed CRISP vote actions to another executor or target.","role":".crispVotingTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed Interfold Protocol Proposal actions to another executor or target.","role":".ippTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to IPP proposal transactions.","role":".ippTrustedForwarderManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.15:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate creation of Interfold Protocol Proposals.","role":".ippConditionRuleManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.17:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future Interfold Protocol Proposals.","role":".ippStageManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.19:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.20:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.13:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.14:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.30:
-        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.38:
+        {"permission":"interact","from":"eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
    contract InterfoldDAO (eth:0x652a31c669f9AB37f6040f279139a75D04F2679e) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.23:
+        {"permissionId":"0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7","where":"eth:0x197be4E09614285Abb4b74b672377c404FD44d54","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.24:
+        {"permissionId":"0x2cf8b99554b63927353c04c2e1cee7fe05352aeb3c52d2576a2f7fd7fb8e180a","where":"eth:0x197be4E09614285Abb4b74b672377c404FD44d54","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.25:
+        {"permissionId":"0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b","where":"eth:0x197be4E09614285Abb4b74b672377c404FD44d54","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.26:
+        {"permissionId":"0x6f36f8bf0398781285f5a40c489dbf3268ce3e205aba87f21e49e6805391b5a1","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.27:
+        {"permissionId":"0xf281525e53675515a6ba7cc7bea8a81e649b3608423ee2d73be1752cea887889","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.28:
+        {"permissionId":"0x06d294bc8cbad2e393408b20dd019a772661f60b8d633e56761157cb1ec85f8c","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.29:
+        {"permissionId":"0x568cc693d84eb1901f8bcecba154cbdef23ca3cf67efc0a0b698528a06c660f7","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.30:
+        {"permissionId":"0x4707e94b25cfce1a7c363508fbb838c35864388ad77284b248282b9746982b9b","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.31:
+        {"permissionId":"0x8c433a4cd6b51969eca37f974940894297b9fcf4b282a213fea5cd8f85289c90","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF","condition":"eth:0xaE0F1082039E715609495Fdb2265b3B53f1296C9"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.32:
+        {"permissionId":"0xb014ce248804cab6a144581acce1eeb70ce5d54f08433b989d73bb0ccee3d3f9","where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.33:
+        {"permissionId":"0xbf04b4486c9663d805744005c3da000eda93de6e3308a4a7a812eb565327b78d","where":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","who":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.34:
+        {"permissionId":"0xd3d98e95f3486fc234d80c098cf0d2a0a3fb187833d7e9cc930f8c4f8335a0e7","where":"eth:0xaE0F1082039E715609495Fdb2265b3B53f1296C9","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Active Aragon grants reconstructed from Granted and Revoked events. The permissionId, target contract (where), grantee (who), and optional condition are preserved.
+++ severity: HIGH
      values.$activePermissions.35:
+        {"permissionId":"0x8c433a4cd6b51969eca37f974940894297b9fcf4b282a213fea5cd8f85289c90","where":"eth:0x197be4E09614285Abb4b74b672377c404FD44d54","who":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","condition":"eth:0x0000000000000000000000000000000000000002"}
+++ description: Current grantees allowed to open votes in the CRISP token-voting plugin.
      values.crispVotingProposalCreators.0:
+        "eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB"
+++ description: Current grantees of the settings-update permission (id 0x2cf8b995...) on the CRISP token-voting plugin.
      values.crispVotingSettingsManagers.0:
+        "eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"
+++ description: Current grantees allowed to redirect the CRISP token-voting plugin's execution target.
      values.crispVotingTargetManagers.0:
+        "eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"
+++ description: Current grantees of Aragon's EXECUTE_PERMISSION on this DAO, reconstructed from grant and revoke events.
      values.daoExecutors.2:
+        "eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB"
+++ description: Current grantees allowed to advance Interfold Protocol Proposals whose stage conditions have passed.
      values.ippAdvancers.0:
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+++ description: Current grantees allowed to replace the IPP proposal-creation condition rules.
      values.ippConditionRuleManagers.0:
+        "eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"
+++ description: Current grantees allowed to execute an Interfold Protocol Proposal after its stages have passed.
      values.ippExecutors.0:
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+++ description: Current grantees allowed to create Interfold Protocol Proposals. Conditional grants remain visible in $activePermissions.
      values.ippProposalCreators.0:
+        "eth:0xFFfFfFffFFfffFFfFFfFFFFFffFFFffffFfFFFfF"
+++ description: Current grantees allowed to replace the Interfold Protocol Proposal (IPP) staged process.
      values.ippStageManagers.0:
+        "eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"
+++ description: Current grantees allowed to redirect the IPP processor's execution target.
      values.ippTargetManagers.0:
+        "eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"
+++ description: Current grantees allowed to replace the IPP processor's trusted meta-transaction forwarder.
      values.ippTrustedForwarderManagers.0:
+        "eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"
+++ description: Current multisig target-configuration grantees derived from Aragon grant/revoke events.
+++ severity: HIGH
      values.multisigTargetConfigAdmins.3:
+        {"where":"eth:0x197be4E09614285Abb4b74b672377c404FD44d54","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}
+++ description: Current multisig target-configuration grantees derived from Aragon grant/revoke events.
+++ severity: HIGH
      values.multisigTargetConfigAdmins.4:
+        {"where":"eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB","who":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}
+++ description: Multisig plugins with public proposal creation configured through Aragon grant/revoke events.
+++ severity: LOW
      values.publicProposalCreators.1:
+        "eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB"
+++ description: Multisig plugins with public proposal execution configured through Aragon grant/revoke events.
+++ severity: LOW
      values.publicProposalExecutors.2:
+        "eth:0x364686f83d7cCEdf88B881B23d4437D1652A8FfB"
      directlyReceivedPermissions.8:
+        {"permission":"interact","from":"eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner"}
      directlyReceivedPermissions.11:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change the settings of the unverified CRISP token-voting plugin used as the IPP voting stage.","role":".crispVotingSettingsManagers"}
      directlyReceivedPermissions.14:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed CRISP vote actions to another executor or target.","role":".crispVotingTargetManagers"}
      directlyReceivedPermissions.15:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed Interfold Protocol Proposal actions to another executor or target.","role":".ippTargetManagers"}
      directlyReceivedPermissions.18:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to IPP proposal transactions.","role":".ippTrustedForwarderManagers"}
      directlyReceivedPermissions.20:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate creation of Interfold Protocol Proposals.","role":".ippConditionRuleManagers"}
      directlyReceivedPermissions.22:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future Interfold Protocol Proposals.","role":".ippStageManagers"}
      directlyReceivedPermissions.24:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers"}
      directlyReceivedPermissions.25:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins"}
      directlyReceivedPermissions.18:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers"}
      directlyReceivedPermissions.19:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins"}
      directlyReceivedPermissions.21:
-        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner"}
      directlyReceivedPermissions.29:
+        {"permission":"interact","from":"eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner"}
    }
```

```diff
    contract SlashingManager (eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4) [interfold/SlashingManager] {
    +++ description: Policy and evidence router for ciphernode penalties, appeals and bans. Slashing is effective only for reasons with an enabled policy and through a manager authorized by the BondingRegistry.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "immutable"
      template:
+        "interfold/SlashingManager"
      sourceHashes:
+        ["0xfda124aac8e1ba6b8dd3120a86020fcd3b8b0705b9515051b12f0cc38ba76a0e"]
      description:
+        "Policy and evidence router for ciphernode penalties, appeals and bans. Slashing is effective only for reasons with an enabled policy and through a manager authorized by the BondingRegistry."
      deployerAddress:
+        "eth:0x34655732dB9BBfA627021D18d786EfF7Bde211F7"
      sinceTimestamp:
+        1789668443
      sinceBlock:
+        25998899
      values:
+        {"$immutable":true,"accessControl":{"DEFAULT_ADMIN_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"]},"GOVERNANCE_ROLE":{"adminRole":"DEFAULT_ADMIN_ROLE","members":["eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"]},"SLASHER_ROLE":{"adminRole":"GOVERNANCE_ROLE","members":[]}},"ACCUSATION_REPORTING_WINDOW":86400,"activeBanCount":0,"activeE3Assignments":2,"APPEAL_RESOLUTION_GRACE":604800,"attestationDomainSeparator":"0x3be893a74512f00ecdaa1eb5e6b768b1f181f31134600ac7b7ec1226539b413b","bannedNodes":[],"bondingRegistry":"eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F","ciphernodeRegistry":"eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7","DEFAULT_ADMIN_ROLE":"0x0000000000000000000000000000000000000000000000000000000000000000","defaultAdmin":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","defaultAdminDelay":172800,"defaultAdminDelayIncreaseWait":432000,"defaultAdmins":["eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"],"DOMAIN_NAME_HASH":"0x7095a59edd8cacb738b8513d8813a0b0e354ecb90ee4c98cc0333e8d23ca8966","DOMAIN_VERSION_HASH":"0xc89efdaa54c0f20c7adf612882df0950f5a951637e0307cdcb4c672f298b8bc6","e3RefundManager":"eth:0x1940eF168f4E0B3dA24BEca539856684793B0F6e","EIP712_DOMAIN_NAME":"InterfoldSlashing","EIP712_DOMAIN_TYPEHASH":"0x8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f","EIP712_DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"InterfoldSlashing","version":"1","chainId":1,"verifyingContract":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"GOVERNANCE_ROLE":"0x71840dc4906352362b0cdaf79870196c8e42acafade72d5d5a6d59291253ceb1","governanceMembers":["eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"],"interfold":"eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715","MAX_APPEAL_WINDOW":2592000,"owner":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","pendingDefaultAdmin":{"newAdmin":"eth:0x0000000000000000000000000000000000000000","schedule":0},"pendingDefaultAdminDelay":{"newDelay":0,"schedule":0},"PROOF_PAYLOAD_TYPEHASH":"0xab434307b5141420c222a231fb024deb0adb4022d9cb04b4244704ea67b44b51","SLASHER_ROLE":"0x12b42e8a160f6064dc959c6f251e3af0750ad213dbecf573b4710d67d6c28e39","slashers":[],"SLASHING_MANAGER_API_VERSION":1,"slashPolicies":{},"totalProposals":0,"VOTE_TYPEHASH":"0x2e073ee263d4a8f6f1a00cb4c7023460ce671f3dc214fddca4ef3d56e9d4740b"}
      fieldMeta:
+        {"accessControl":{"description":"Current role administrators and members."},"defaultAdmins":{"description":"Members of DEFAULT_ADMIN_ROLE.","type":"PERMISSION"},"governanceMembers":{"description":"Members of GOVERNANCE_ROLE.","type":"PERMISSION"},"slashers":{"description":"Members of SLASHER_ROLE.","type":"PERMISSION"},"slashPolicies":{"description":"Latest configured slashing policy for each reason. An empty map means no ticket or FOLD penalty can currently be proposed through this manager.","type":"RISK_PARAMETER"},"bannedNodes":{"description":"Currently banned operator keys reconstructed from ban-status events."},"defaultAdminDelay":{"description":"Delay for transferring DEFAULT_ADMIN_ROLE. It does not delay calls made by the current admin or governance-role members.","type":"RISK_PARAMETER"}}
      implementationNames:
+        {"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4":"SlashingManager"}
      category:
+        {"name":"Local Infrastructure","priority":5}
      receivedPermissions:
+        [{"permission":"interact","from":"eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F","description":"slash operator ticket collateral and FOLD bonds, ban operators and manage slash-routing state.","role":".authorizedSlashingManagerAt"},{"permission":"interact","from":"eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7","description":"expel selected members from active committees.","role":".slashingManager"}]
    }
```

```diff
    contract InterfoldSafeB (eth:0x8B43b2852fc5031D01DDfCDF702973D93A2FF593) [GnosisSafe] {
    +++ description: None
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change the settings of the unverified CRISP token-voting plugin used as the IPP voting stage.","role":".crispVotingSettingsManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.9:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed CRISP vote actions to another executor or target.","role":".crispVotingTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed Interfold Protocol Proposal actions to another executor or target.","role":".ippTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.13:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to IPP proposal transactions.","role":".ippTrustedForwarderManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.15:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate creation of Interfold Protocol Proposals.","role":".ippConditionRuleManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.17:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future Interfold Protocol Proposals.","role":".ippStageManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.19:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.20:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.13:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.14:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.30:
-        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.38:
+        {"permission":"interact","from":"eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
-   Status: DELETED
    contract SlashingManager (eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9) [interfold/SlashingManager]
    +++ description: Policy and evidence router for ciphernode penalties, appeals and bans. Slashing is effective only for reasons with an enabled policy and through a manager authorized by the BondingRegistry.
```

```diff
    contract PublicStagedProposalProcessor (eth:0x9c0Ff283399Bd1D3111E6c9C689066759b7AccDb) [interfold/StagedProposalProcessor] {
    +++ description: Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows.
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change the settings of the unverified CRISP token-voting plugin used as the IPP voting stage.","role":".crispVotingSettingsManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed CRISP vote actions to another executor or target.","role":".crispVotingTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.12:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed Interfold Protocol Proposal actions to another executor or target.","role":".ippTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.15:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to IPP proposal transactions.","role":".ippTrustedForwarderManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.17:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate creation of Interfold Protocol Proposals.","role":".ippConditionRuleManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.19:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future Interfold Protocol Proposals.","role":".ippStageManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.21:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.22:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.15:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.16:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.32:
-        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.40:
+        {"permission":"interact","from":"eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
    contract NodeReleaseRegistry (eth:0x9E1C6B433CFbC8f28d80EAB583C428B01d083b0A) [interfold/NodeReleaseRegistry] {
    +++ description: Registry of ciphernode software releases. Operators self-attest the release they run; staying eligible for new E3 committees requires an attestation matching the exact governance-set protocol version and at least the required node generation. Raising the requirement instantly invalidates every operator's cached eligibility until they re-attest.
+++ description: Exact ciphernode protocol version operators must attest to remain eligible.
      values.requiredProtocolVersion:
-        1
+        4
    }
```

```diff
-   Status: DELETED
    contract DkgAggregatorVerifier (eth:0x9e58443eB40A1B08D07f89D36bf69909d401a542) [interfold/DkgAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV distributed-key-generation aggregation circuit.
```

```diff
-   Status: DELETED
    contract ChainlinkVrfRandomnessProvider (eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712) [interfold/ChainlinkVrfRandomnessProvider]
    +++ description: Supplies committee-sortition entropy as a Chainlink VRF v2.5 subscription consumer. Only its fixed requester (the CiphernodeRegistry) can request randomness, each E3 can be served exactly once, and requests revert while the funding subscription balance is below the configured minimum. All VRF parameters are immutable.
```

```diff
    contract ProtocolProposalCondition (eth:0xaE0F1082039E715609495Fdb2265b3B53f1296C9) [interfold/SPPRuleCondition] {
    +++ description: Aragon condition attached to the public CREATE_PROPOSAL permission. Its mutable rule program determines which callers and proposal calls qualify for the otherwise-public grant.
      type:
-        "EOA"
+        "Contract"
      proxyType:
-        "EOA"
+        "EIP1167 proxy"
      template:
+        "interfold/SPPRuleCondition"
      sourceHashes:
+        ["0x820364f6b02461f786e2dfaa81e0059689349246f89bf5b49bf33424d05d117e","0x820364f6b02461f786e2dfaa81e0059689349246f89bf5b49bf33424d05d117e"]
      description:
+        "Aragon condition attached to the public CREATE_PROPOSAL permission. Its mutable rule program determines which callers and proposal calls qualify for the otherwise-public grant."
      deployerAddress:
+        "eth:0x34655732dB9BBfA627021D18d786EfF7Bde211F7"
      sinceTimestamp:
+        1789739891
      sinceBlock:
+        26004832
      values:
+        {"$implementation":"eth:0xE437E5c7EeB0D49F97CfD040fb8a02A60a61c0f0","dao":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","getRules":[],"protocolVersion":[1,4,0],"UPDATE_RULES_PERMISSION_ID":"0xd3d98e95f3486fc234d80c098cf0d2a0a3fb187833d7e9cc930f8c4f8335a0e7"}
      fieldMeta:
+        {"dao":{"description":"Aragon DAO whose permission manager controls updates to the condition's rule program."},"getRules":{"description":"Current ordered rule program evaluated for public proposal creation.","type":"RISK_PARAMETER"}}
      implementationNames:
+        {"eth:0xaE0F1082039E715609495Fdb2265b3B53f1296C9":"SPPRuleCondition","eth:0xE437E5c7EeB0D49F97CfD040fb8a02A60a61c0f0":"SPPRuleCondition"}
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
-   Status: DELETED
    contract BfvPkVerifier (eth:0xBA1854fDA7A5c127606572e43Dc7B37b7A15bdFf) [interfold/BfvPkVerifier]
    +++ description: BFV public-key proof wrapper. It binds the generated circuit verifier to the expected DKG-fold and C5 verification-key hashes.
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider.
      sourceHashes.1:
-        "0x993dbb9f6f7d08758f2b721cf9a1c301f9a7234933ca34d0430901203f34f1cf"
+        "0xaaf0cc5a82e6d85f4cb4d4b1cdfe655456ddfd34d6a347cf23f5f5acb505fd7c"
      values.$implementation:
-        "eth:0xFff476751949a7e1B784b5c88648833c1e8dD69c"
+        "eth:0xD9A3224D829a4ac8b55A75C539fD447AC4B05Bf2"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.21:
+        "eth:0xc6E48712E56F6E9548c54a0A983eBe992eFA26Bd"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.22:
+        "eth:0x1fD2b3d4a9f4Aeb62877cab9dF70A5a6e976b118"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.23:
+        "eth:0x9EC16384b956D7B2A71284711FD32d156e6b33c6"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.24:
+        "eth:0xd2b46ceC7b4d8046eF2D7bCb32aF3220Ef7bc1dd"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.25:
+        "eth:0xd3336047DCf4d7C7393b3BF5Fa47A31478C22d47"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.26:
+        "eth:0xA2bA6A63335cdB2789b0e636987Ce12C3D44662a"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.27:
+        "eth:0xd698bC33a4A98a019881c6e2664f1dAc62c4B3B5"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.28:
+        "eth:0x76f3491D36138450F957b03F657dDa258Ad4c0E7"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.29:
+        "eth:0x2048E0750655298E628155Ca5024F0b30D896e51"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.30:
+        "eth:0x69760AF47771F8F763B5E3cb88601C197b0ee235"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.31:
+        "eth:0xAF92b142F15eb873f7D1d9F05c8c9b1855698249"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.32:
+        "eth:0xBf11E6B5be2ff90CDC6860BAe7941e44aa52DEc3"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.33:
+        "eth:0x8DEeF8799921D549BAC469aD6d37912DBeB2432a"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.34:
+        "eth:0xfbe2eEB95eb083F89bBb1C9c384328d9cfE43d47"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.35:
+        "eth:0x3394971Ee0cb5bc6336F8C36bc8807CDAA8BB017"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.36:
+        "eth:0x9D129a1733ab0f56460cCCfdC807C797b5a1a53c"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.37:
+        "eth:0x160AC642aC8Ef8bd4491d22A46772B773960B4b5"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.38:
+        "eth:0x0dB1A5DA3481Ce66B81FC7A48dD982FA0AcFCC99"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.39:
+        "eth:0x4429dB606a7c476762E4c7003963603f97a3C031"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.40:
+        "eth:0xd99672d25e783F245D3E0183581fAae0c154B8b6"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.41:
+        "eth:0x62b2dF039198096259F8dc619cE5E79507806A00"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.42:
+        "eth:0x5BA3ef7913D6dD46e2b4EBd8A05eF4615ae8Be5B"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.43:
+        "eth:0x780c1bB4Abc6F4324813e58a52C9d2FEF055ef78"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.44:
+        "eth:0xfC16c9513bB6b4FE7978723bB2468E99D8A34d70"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.45:
+        "eth:0x9aCc89CCD297064779C4e0f1c353079975C731b6"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.46:
+        "eth:0xFD97D727CdF9867944de554E45499D5162bDBfAc"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.47:
+        "eth:0x5cFc8841C3fBb3CA8dCb2BfBD3a39a98dE5B942a"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.48:
+        "eth:0xcD34cF9C66F524c91A14e67D3eF68157f809Abf7"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.49:
+        "eth:0x6B035c1b0B099555284C8676e48e2C3CB8b3d4B0"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.50:
+        "eth:0x86FBE1027577A343c1C9DcCAEc470d2B613cB347"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.51:
+        "eth:0x2358424b1E347f1FAADB7F54C5eB57eeA3A2738d"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.52:
+        "eth:0xFcEdB9Af33A338A80DA84785023BfDb988CaAd6E"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.53:
+        "eth:0x7E94eEd05e81679F69dA44157a45F0528DA9Ce66"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.54:
+        "eth:0xFF79709339F5dBCA606c8b9D4940390d61cB4B29"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.55:
+        "eth:0x2A2Df1e79ec3be51c0B050175E3D897e3911dC42"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.56:
+        "eth:0xDa1D20efb36e7F3bb47CEDbF471feB099051e717"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.57:
+        "eth:0x58C40cEC1ebAc2e383B5091ed47fa719a29f00A4"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.58:
+        "eth:0x5Fb0854aB8fb2810b80d3DE276b3107a9e5281b1"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition.
      values.$members.59:
+        "eth:0x88ED57A03E98931a81dBa7A9Bc2dc95B48929E45"
      values.$pastUpgrades.2:
+        ["2026-09-18T13:15:47.000Z","0x975b5104729480bdf914304ce81726041e27450580fab4cd2f2750b7f0848047",["eth:0xD9A3224D829a4ac8b55A75C539fD447AC4B05Bf2"]]
      values.$upgradeCount:
-        2
+        3
      values.MAX_CIPHERNODE_LEAVES:
-        1048576
+        1048575
      values.MAX_COMMITTEE_PUBLIC_KEY_BYTES:
-        262144
+        524288
+++ description: Contract that supplies the asynchronous sortition entropy for committee selection. Automatically reset to zero, which disables new E3 requests, if a randomness request expires without a usable response (circuit breaker). Replacing it requires paused requests, no outstanding committees, and that the new provider names this registry as its only requester.
+++ severity: HIGH
      values.randomnessProvider:
-        "eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712"
+        "eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00"
      values.slashingManager:
-        "eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9"
+        "eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4"
      values.unreleasedCommitteeCount:
-        0
+        1
+++ description: Whether the randomness circuit breaker has tripped, which blocks new E3 requests until governance resets the provider.
      values.randomnessDegraded:
+        false
      implementationNames.eth:0xFff476751949a7e1B784b5c88648833c1e8dD69c:
-        "CiphernodeRegistryOwnable"
      implementationNames.eth:0xD9A3224D829a4ac8b55A75C539fD447AC4B05Bf2:
+        "CiphernodeRegistryOwnable"
    }
```

```diff
-   Status: DELETED
    contract BfvDecryptionVerifier (eth:0xf143b969ea481Ccf251194D15F82007C67AABc53) [interfold/BfvDecryptionVerifier]
    +++ description: Threshold-decryption proof wrapper. It checks the generated circuit proof and binds its parties and public-key context to the committee recorded by CiphernodeRegistry.
```

```diff
    contract AdminPlugin (eth:0xF21e25455988887EE797050080141eba67B33920) [interfold/AdminPlugin] {
    +++ description: Non-upgradeable Aragon Admin plugin. Holders of its DAO-granted EXECUTE_PROPOSAL permission can submit actions that the plugin forwards immediately, without a vote or onchain delay.
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3","description":"set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.7:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"change the settings of the unverified CRISP token-voting plugin used as the IPP voting stage.","role":".crispVotingSettingsManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.10:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed CRISP vote actions to another executor or target.","role":".crispVotingTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.11:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"redirect passed Interfold Protocol Proposal actions to another executor or target.","role":".ippTargetManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.14:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the address trusted to append the effective caller to IPP proposal transactions.","role":".ippTrustedForwarderManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.16:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the rules that gate creation of Interfold Protocol Proposals.","role":".ippConditionRuleManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.18:
+        {"permission":"interact","from":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e","description":"replace the stages, bodies, thresholds and timing rules for future Interfold Protocol Proposals.","role":".ippStageManagers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.20:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.21:
+        {"permission":"interact","from":"eth:0x753109Ee36Dc65cC178875AddA30C6433e5bEEe4","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.14:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"create or disable slash policies, grant or revoke evidence slashers, resolve appeals, close E3 assignments and propose, confirm or remove operator bans.","role":".governanceMembers","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.15:
-        {"permission":"interact","from":"eth:0x974E865B1BB24AF2a9ef8204AdEA9251Cc7C5FD9","description":"replace the coordinator, bonding registry, ciphernode registry and refund manager, and grant or revoke governance membership. A transfer of the default-admin role itself has the configured delay.","role":".defaultAdmins","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.31:
-        {"permission":"interact","from":"eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
      receivedPermissions.39:
+        {"permission":"interact","from":"eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00","description":"replace the Chainlink VRF coordinator that delivers the sortition entropy.","role":".owner","via":[{"address":"eth:0x652a31c669f9AB37f6040f279139a75D04F2679e"}]}
    }
```

```diff
+   Status: CREATED
    contract DkgAggregatorVerifier (eth:0x00a586aB1E533e2544daAF4BB7388e176320572F) [interfold/DkgAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV distributed-key-generation aggregation circuit.
```

```diff
+   Status: CREATED
    contract BfvDecryptionVerifier (eth:0x0Be6f92594ee8776C7c658eFA1ec6Ca12F5D9701) [interfold/BfvDecryptionVerifier]
    +++ description: Threshold-decryption proof wrapper. It checks the generated circuit proof and binds its parties and public-key context to the committee recorded by CiphernodeRegistry.
```

```diff
+   Status: CREATED
    contract DkgAggregatorVerifier (eth:0x1Eba833dd9CBC32c925B4a54DBC7682Ac276f302) [interfold/DkgAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV distributed-key-generation aggregation circuit.
```

```diff
+   Status: CREATED
    contract BfvPkVerifier (eth:0x3C1C772B1D800ff4E6F8d0c02E1e6D07293c0059) [interfold/BfvPkVerifier]
    +++ description: BFV public-key proof wrapper. It binds the generated circuit verifier to the expected DKG-fold and C5 verification-key hashes.
```

```diff
+   Status: CREATED
    contract CRISPProgramV2 (eth:0x53FCdb21E73A461CfE6c64B19855204384B91BA3) [interfold/CRISPProgram]
    +++ description: CRISP encrypted-ballot E3 application. It verifies ballot eligibility and encryption proofs, commits ciphertext inputs, checks that a RISC Zero tally is bound to its input root and parameters, and decodes the threshold-decrypted tally.
```

```diff
+   Status: CREATED
    contract BfvPkVerifier (eth:0x55F7379898512dEdCc994109a590e7d6a6eB50D8) [interfold/BfvPkVerifier]
    +++ description: BFV public-key proof wrapper. It binds the generated circuit verifier to the expected DKG-fold and C5 verification-key hashes.
```

```diff
+   Status: CREATED
    contract BfvPkVerifier (eth:0x67DDfB579EB5dC7df9B3f7Cfd942f325a792Afc3) [interfold/BfvPkVerifier]
    +++ description: BFV public-key proof wrapper. It binds the generated circuit verifier to the expected DKG-fold and C5 verification-key hashes.
```

```diff
+   Status: CREATED
    contract BfvPkVerifierRouter (eth:0x7CD10057c25674bd5666A9deEE3193f1b29563d1) [interfold/BfvPkVerifierRouter]
    +++ description: Immutable router for BFV distributed-key-generation proofs. It forwards each proof to the per-committee-size BfvPkVerifier whose public-input length and circuit verification-key hashes match, so committees of every supported size share one verifier entry point.
```

```diff
+   Status: CREATED
    contract Risc0BfvCiphertextVerifier (eth:0x80D217d3b2e16fF2ecc178cC75655C773895c549) [interfold/Risc0BfvCiphertextVerifier]
    +++ description: Ciphertext-output verifier for BFV E3s. It accepts a RISC Zero receipt for the immutable guest image ID against the E3-specific journal constructed by Interfold.
```

```diff
+   Status: CREATED
    contract BfvDecryptionVerifier (eth:0x86ba053b37a844FcD2dd52aBC69fc4D69D965Ad8) [interfold/BfvDecryptionVerifier]
    +++ description: Threshold-decryption proof wrapper. It checks the generated circuit proof and binds its parties and public-key context to the committee recorded by CiphernodeRegistry.
```

```diff
+   Status: CREATED
    contract BfvDecryptionVerifierRouter (eth:0xA66CAb7AE230698b2a9ee1E0E967BaD4651FeEa7) [interfold/BfvDecryptionVerifierRouter]
    +++ description: Immutable router for BFV threshold-decryption proofs. It forwards each proof to the per-committee-size BfvDecryptionVerifier whose public-input length and circuit verification-key hashes match, so committees of every supported size share one verifier entry point.
```

```diff
+   Status: CREATED
    contract DkgAggregatorVerifier (eth:0xaC784625D32Ce7840D3f0EBD7E5832ea34C188C0) [interfold/DkgAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV distributed-key-generation aggregation circuit.
```

```diff
+   Status: CREATED
    contract DecryptionAggregatorVerifier (eth:0xbeF207838845b227394Eb46579372FEE5E2a95fd) [interfold/DecryptionAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV threshold-decryption aggregation circuit.
```

```diff
+   Status: CREATED
    contract DecryptionAggregatorVerifier (eth:0xBFAE594dc43f4b910F478ec00D285B8daC66855F) [interfold/DecryptionAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV threshold-decryption aggregation circuit.
```

```diff
+   Status: CREATED
    contract AvailVectorXDataAvailabilityVerifier (eth:0xC038C7ba5717bDa886115e5d954085bce069069E) [interfold/AvailVectorXDataAvailabilityVerifier]
    +++ description: Immutable verifier of Avail blob inclusion used by the CRISP program to attest that encrypted ballot inputs were published. It checks inclusion proofs against the Avail bridge and VectorX light-client contracts fixed at deployment.
```

```diff
+   Status: CREATED
    contract RandomnessProvider (eth:0xC60919F8Bd128B76E11F4B071C8c38e1391a3e00) [interfold/ChainlinkVrfRandomnessProvider]
    +++ description: Supplies committee-sortition entropy as a Chainlink VRF v2.5 subscription consumer. Only its fixed requester (the CiphernodeRegistry) can request randomness, each E3 can be served exactly once, and requests revert while the funding subscription balance is below the configured minimum. All VRF parameters are immutable.
```

```diff
+   Status: CREATED
    EOA (eth:0xd698bC33a4A98a019881c6e2664f1dAc62c4B3B5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DecryptionAggregatorVerifier (eth:0xEB4D0d5FfbDD508d6FF352255DCFc7b13FA28EC0) [interfold/DecryptionAggregatorVerifier]
    +++ description: Immutable generated Honk verifier for the BFV threshold-decryption aggregation circuit.
```

```diff
+   Status: CREATED
    contract BfvDecryptionVerifier (eth:0xf6ed505997d2F572717f5E946b70efd65D55c986) [interfold/BfvDecryptionVerifier]
    +++ description: Threshold-decryption proof wrapper. It checks the generated circuit proof and binds its parties and public-key context to the committee recorded by CiphernodeRegistry.
```

## Source code changes

```diff
.../.flat/AvailVectorXDataAvailabilityVerifier.sol |   130 +
 ...0x0Be6f92594ee8776C7c658eFA1ec6Ca12F5D9701.sol} |     0
 ...:0x86ba053b37a844FcD2dd52aBC69fc4D69D965Ad8.sol | 10348 ++++++++++++++++
 ...:0xf6ed505997d2F572717f5E946b70efd65D55c986.sol | 10348 ++++++++++++++++
 .../.flat/BfvDecryptionVerifierRouter.sol          |   189 +
 ...0x3C1C772B1D800ff4E6F8d0c02E1e6D07293c0059.sol} |     0
 ...:0x55F7379898512dEdCc994109a590e7d6a6eB50D8.sol |   262 +
 ...:0x67DDfB579EB5dC7df9B3f7Cfd942f325a792Afc3.sol |   262 +
 .../interfold/.flat/BfvPkVerifierRouter.sol        |   179 +
 .../BondingRegistry/BondingRegistry.sol            |   297 +-
 .../projects/interfold/.flat/CRISPProgramV2.sol    | 12306 +++++++++++++++++++
 .../CiphernodeRegistryOwnable.sol                  |   700 +-
 .../.flat/CrispTokenVoting/CrispVoting.sol         |  5755 +++++++++
 .../.flat/CrispTokenVoting/ERC1967Proxy.p.sol      |   679 +
 ...0xBFAE594dc43f4b910F478ec00D285B8daC66855F.sol} |     0
 ...:0xEB4D0d5FfbDD508d6FF352255DCFc7b13FA28EC0.sol |  3281 +++++
 ...:0xbeF207838845b227394Eb46579372FEE5E2a95fd.sol |  3281 +++++
 ...:0x00a586aB1E533e2544daAF4BB7388e176320572F.sol |  3281 +++++
 ...0x1Eba833dd9CBC32c925B4a54DBC7682Ac276f302.sol} |    86 +-
 ...:0xaC784625D32Ce7840D3f0EBD7E5832ea34C188C0.sol |  3281 +++++
 .../E3RefundManager/E3RefundManager.sol            |   949 +-
 .../Interfold/Interfold.sol                        |  1146 +-
 .../SPPRuleCondition.p.sol                         |  1361 ++
 .../ProtocolProposalCondition/SPPRuleCondition.sol |  1361 ++
 .../ProtocolProposalProcessor/ERC1967Proxy.p.sol   |   679 +
 .../StagedProposalProcessor.sol                    |  3147 +++++
 .../RandomnessProvider.sol}                        |  7500 +++++------
 ...0x40a18Fc27ac4a4d86fA70385c6814e453b6BFF2c.sol} |     0
 ...:0x80D217d3b2e16fF2ecc178cC75655C773895c549.sol |   165 +
 .../SlashingManager.sol                            |   583 +-
 30 files changed, 67385 insertions(+), 4171 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789471922 (main branch discovery), not current.

```diff
    contract Interfold (eth:0x28cF63B459e6218C69EA97ea7D90541cf648c715) [interfold/Interfold] {
    +++ description: Coordinator for Encrypted Execution Environments (E3s). It accepts requests for allowlisted programs, selects a ciphernode committee, snapshots the configured proof system, and verifies the encrypted result and threshold decryption before publishing plaintext output.
      values.bfvCommitteeSize:
-        3
      values.bfvDecryptionThreshold:
-        2
      values.bfvParamSet:
-        "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000064000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000ffffee0010000000000000000000000000000000000000000000000000000000ffffc400100000000000000000000000000000000000000000000000000000000000000013300000000000000000000000000000000000000000000000000000000000000"
      fieldMeta.bfvDecryptionThreshold:
-        {"severity":"HIGH","description":"Number of decryption shares required for the active minimum-size BFV committee.","type":"RISK_PARAMETER"}
      fieldMeta.bfvCommitteeSize:
-        {"severity":"HIGH","description":"Number of ciphernode seats in the active minimum-size BFV committee.","type":"RISK_PARAMETER"}
      fieldMeta.bfvParamSet:
-        {"severity":"HIGH","description":"ABI-encoded BFV parameter set accepted by the active circuits. Param-set index 0 is the only set accepted by the current crypto configuration.","type":"RISK_PARAMETER"}
      fieldMeta.activeCryptoConfigId.description:
-        "Hash of the exact circuit configuration accepted for new requests."
+        "Compiled-in identifier of the BFV parameter set and circuit configuration accepted for new requests. Changing it requires a new implementation."
      fieldMeta.MAX_COMMITTEE_SIZE:
+        {"severity":"HIGH","description":"Committee size of the compiled-in active BFV configuration; the matching decryption threshold and assumed-honest count are constants of the ActiveCryptoConfig library in the verified source and are not readable onchain.","type":"RISK_PARAMETER"}
    }
```

```diff
    contract Risc0BfvCiphertextVerifier (eth:0x40a18Fc27ac4a4d86fA70385c6814e453b6BFF2c) [interfold/Risc0BfvCiphertextVerifier] {
    +++ description: Ciphertext-output verifier for BFV E3s. It accepts a RISC Zero receipt for the immutable guest image ID against the E3-specific journal constructed by Interfold.
      unverified:
-        true
      description:
-        "Unverified wrapper that accepts a RISC Zero receipt for the immutable guest image ID and the E3-specific journal constructed by Interfold."
+        "Ciphertext-output verifier for BFV E3s. It accepts a RISC Zero receipt for the immutable guest image ID against the E3-specific journal constructed by Interfold."
      fieldMeta.risc0Verifier.description:
-        "Immutable RISC Zero verifier used to validate computation receipts."
+        "Immutable RISC Zero verifier used to validate computation receipts. The external RISC Zero deployment is outside this discovery perimeter."
      implementationNames.eth:0x40a18Fc27ac4a4d86fA70385c6814e453b6BFF2c:
-        ""
+        "Risc0BfvCiphertextVerifier"
      template:
+        "interfold/Risc0BfvCiphertextVerifier"
      sourceHashes:
+        ["0x52029d94ccab4c67a4566736cf4e3514382d38b2024aa5380365898569c32d98"]
    }
```

```diff
    contract InterfoldSafeA (eth:0x5429D8c7fD14023f3c414126F94BbE25A05fC018) [GnosisSafe] {
    +++ description: None
      receivedPermissions.12.description:
-        "set the eligible-voter Merkle root once per requester-census E3 and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
+        "set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
    }
```

```diff
    contract InterfoldDAO (eth:0x652a31c669f9AB37f6040f279139a75D04F2679e) [zama/ZamaDAO] {
    +++ description: Aragon DAO that stores governance state and executes proposal action batches.
+++ description: Current grantees allowed to open votes in the CRISP token-voting plugin.
      values.crispVotingProposalCreators:
+        []
+++ description: Current grantees of the settings-update permission (id 0x2cf8b995...) on the CRISP token-voting plugin.
      values.crispVotingSettingsManagers:
+        []
+++ description: Current grantees allowed to redirect the CRISP token-voting plugin's execution target.
      values.crispVotingTargetManagers:
+        []
+++ description: Current grantees of the UPGRADE_PLUGIN permission on the CRISP token-voting plugin.
      values.crispVotingUpgraders:
+        []
+++ description: Current grantees allowed to advance Interfold Protocol Proposals whose stage conditions have passed.
      values.ippAdvancers:
+        []
+++ description: Current grantees allowed to replace the IPP proposal-creation condition rules.
      values.ippConditionRuleManagers:
+        []
+++ description: Current grantees allowed to execute an Interfold Protocol Proposal after its stages have passed.
      values.ippExecutors:
+        []
+++ description: Current grantees allowed to create Interfold Protocol Proposals. Conditional grants remain visible in $activePermissions.
      values.ippProposalCreators:
+        []
+++ description: Current grantees allowed to replace the Interfold Protocol Proposal (IPP) staged process.
      values.ippStageManagers:
+        []
+++ description: Current grantees allowed to redirect the IPP processor's execution target.
      values.ippTargetManagers:
+        []
+++ description: Current grantees allowed to replace the IPP processor's trusted meta-transaction forwarder.
      values.ippTrustedForwarderManagers:
+        []
+++ description: Current grantees of the UPGRADE_PLUGIN permission on the IPP processor.
      values.ippUpgraders:
+        []
      fieldMeta.ippStageManagers:
+        {"description":"Current grantees allowed to replace the Interfold Protocol Proposal (IPP) staged process.","type":"PERMISSION"}
      fieldMeta.ippProposalCreators:
+        {"description":"Current grantees allowed to create Interfold Protocol Proposals. Conditional grants remain visible in $activePermissions.","type":"PERMISSION"}
      fieldMeta.ippAdvancers:
+        {"description":"Current grantees allowed to advance Interfold Protocol Proposals whose stage conditions have passed.","type":"PERMISSION"}
      fieldMeta.ippExecutors:
+        {"description":"Current grantees allowed to execute an Interfold Protocol Proposal after its stages have passed.","type":"PERMISSION"}
      fieldMeta.ippTargetManagers:
+        {"description":"Current grantees allowed to redirect the IPP processor's execution target.","type":"PERMISSION"}
      fieldMeta.ippTrustedForwarderManagers:
+        {"description":"Current grantees allowed to replace the IPP processor's trusted meta-transaction forwarder.","type":"PERMISSION"}
      fieldMeta.ippUpgraders:
+        {"description":"Current grantees of the UPGRADE_PLUGIN permission on the IPP processor.","type":"PERMISSION"}
      fieldMeta.ippConditionRuleManagers:
+        {"description":"Current grantees allowed to replace the IPP proposal-creation condition rules.","type":"PERMISSION"}
      fieldMeta.crispVotingSettingsManagers:
+        {"description":"Current grantees of the settings-update permission (id 0x2cf8b995...) on the CRISP token-voting plugin.","type":"PERMISSION"}
      fieldMeta.crispVotingProposalCreators:
+        {"description":"Current grantees allowed to open votes in the CRISP token-voting plugin.","type":"PERMISSION"}
      fieldMeta.crispVotingTargetManagers:
+        {"description":"Current grantees allowed to redirect the CRISP token-voting plugin's execution target.","type":"PERMISSION"}
      fieldMeta.crispVotingUpgraders:
+        {"description":"Current grantees of the UPGRADE_PLUGIN permission on the CRISP token-voting plugin.","type":"PERMISSION"}
      directlyReceivedPermissions.17.description:
-        "set the eligible-voter Merkle root once per requester-census E3 and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
+        "set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
    }
```

```diff
    contract CRISPProgram (eth:0x847A22303639017bcDB7F7E49EEa4a4629c1169f) [interfold/CRISPProgram] {
    +++ description: CRISP encrypted-ballot E3 application. It verifies ballot eligibility and encryption proofs, commits ciphertext inputs, checks that a RISC Zero tally is bound to its input root and parameters, and decodes the threshold-decrypted tally.
      unverified:
-        true
      description:
-        "CRISP encrypted-ballot application. It verifies ballot eligibility and encryption proofs, commits ciphertext inputs, checks that a RISC Zero tally is bound to its input root and parameters, and decodes the threshold-decrypted tally."
+        "CRISP encrypted-ballot E3 application. It verifies ballot eligibility and encryption proofs, commits ciphertext inputs, checks that a RISC Zero tally is bound to its input root and parameters, and decodes the threshold-decrypted tally."
      values.eip712Domain:
+        {"fields":"0x0f","name":"CRISP","version":"1","chainId":1,"verifyingContract":"eth:0x847A22303639017bcDB7F7E49EEa4a4629c1169f","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]}
      values.ENCRYPTION_SCHEME_ID:
+        "0x2c2a814a0495f913a3a312fc4771e37552bc14f8a2d4075a08122d356f0849c6"
      values.TREE_DEPTH:
+        20
      fieldMeta.interfold.description:
-        "Permanently bound E3 coordinator."
+        "Bound E3 coordinator."
      fieldMeta.dataAvailabilityVerifier:
+        {"description":"Immutable verifier of the proof-backed data availability attestation for ballot inputs.","type":"CODE_CHANGE"}
      fieldMeta.inputAvailabilitySigner:
+        {"description":"Immutable signer whose attestations vouch for ballot input availability.","type":"PERMISSION"}
      fieldMeta.availabilityFinalizationWindow:
+        {"description":"Immutable window after voting in which input availability must be finalized.","type":"RISK_PARAMETER"}
      implementationNames.eth:0x847A22303639017bcDB7F7E49EEa4a4629c1169f:
-        ""
+        "CRISPProgram"
      template:
+        "interfold/CRISPProgram"
      sourceHashes:
+        ["0x3649deb6f04282f42e1920d5db900615f2452d03163421de0763f9849233a388"]
    }
```

```diff
    contract InterfoldSafeB (eth:0x8B43b2852fc5031D01DDfCDF702973D93A2FF593) [GnosisSafe] {
    +++ description: None
      receivedPermissions.12.description:
-        "set the eligible-voter Merkle root once per requester-census E3 and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
+        "set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
    }
```

```diff
    contract PublicStagedProposalProcessor (eth:0x9c0Ff283399Bd1D3111E6c9C689066759b7AccDb) [interfold/StagedProposalProcessor] {
    +++ description: Upgradeable Aragon staged-proposal plugin that executes DAO actions after proposals pass its configured sequence of voting or manual bodies, thresholds and timing windows.
      receivedPermissions.14.description:
-        "set the eligible-voter Merkle root once per requester-census E3 and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
+        "set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
    }
```

```diff
    contract ChainlinkVrfRandomnessProvider (eth:0xa0273f884816dfF0BE9B5ED50aB3AA29D6AaA712) [interfold/ChainlinkVrfRandomnessProvider] {
    +++ description: Supplies committee-sortition entropy as a Chainlink VRF v2.5 subscription consumer. Only its fixed requester (the CiphernodeRegistry) can request randomness, each E3 can be served exactly once, and requests revert while the funding subscription balance is below the configured minimum. All VRF parameters are immutable.
      name:
-        "RandomnessProvider"
+        "ChainlinkVrfRandomnessProvider"
    }
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider.
      values.$threshold:
-        2
      values.selectedCommitteeSize:
-        3
      fieldMeta.$members.description:
-        "Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry."
+        "Current registered ciphernode operator keys reconstructed from add and remove events. For each E3 a committee of the coordinator's MAX_COMMITTEE_SIZE is selected from these keys by ticket-weighted sortition."
      fieldMeta.$threshold:
-        {"description":"Decryption shares required within each newly selected minimum-size committee. This represents two of the selected three ciphernodes, not two of all registered $members."}
      fieldMeta.selectedCommitteeSize:
-        {"description":"Number of ciphernodes selected from $members for each minimum-size committee.","type":"RISK_PARAMETER"}
      fieldMeta.randomnessDegraded:
+        {"description":"Whether the randomness circuit breaker has tripped, which blocks new E3 requests until governance resets the provider.","type":"RISK_PARAMETER"}
    }
```

```diff
    contract AdminPlugin (eth:0xF21e25455988887EE797050080141eba67B33920) [interfold/AdminPlugin] {
    +++ description: Non-upgradeable Aragon Admin plugin. Holders of its DAO-granted EXECUTE_PROPOSAL permission can submit actions that the plugin forwards immediately, without a vote or onchain delay.
      receivedPermissions.13.description:
-        "set the eligible-voter Merkle root once per requester-census E3 and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
+        "set census roots and replace the application RISC Zero verifier or guest image ID immediately. Such replacement cannot change the verifier snapshotted by Interfold, but can make an in-flight round fail."
    }
```

Generated with discovered.json: 0x1f678011c5d44b365f3b7fe6b72f06e40529e2f7

# Diff at Mon, 21 Sep 2026 11:24:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@231e4a5828ee5ff5a863f7b80215466ca39a5b1e block: 1789471922
- current timestamp: 1789471922

## Description

ossification re-review: field severities

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789471922 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x2DFb93A8C3cE68Be3d8129479d7870646d89aDa7) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0x9393573a9EF85c9A37d91E32702a340084A48b6E) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0xB3985D7fF844FA0F5E0aaC5feb5DD8BE15e88580) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

```diff
    contract ProxyAdmin (eth:0xf1511Fc32abf7Bd3a3213ddCF08C07259b53972b) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta.addressManager:
+        {"severity":"HIGH"}
    }
```

Generated with discovered.json: 0xf749285961d64ef74826b789adf529ac539d4c5c

# Diff at Fri, 18 Sep 2026 10:24:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@e2faf827d006bceee5fb0904599ba325066c7674 block: 1789471922
- current timestamp: 1789471922

## Description

critical contracts and severities for the ossification perimeter

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1789471922 (main branch discovery), not current.

```diff
    contract ProxyAdmin (eth:0x2DFb93A8C3cE68Be3d8129479d7870646d89aDa7) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0x9393573a9EF85c9A37d91E32702a340084A48b6E) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xB3985D7fF844FA0F5E0aaC5feb5DD8BE15e88580) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

```diff
    contract ProxyAdmin (eth:0xf1511Fc32abf7Bd3a3213ddCF08C07259b53972b) [global/ProxyAdmin] {
    +++ description: None
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0xcc0a725f20e81a749031616e4d3d738554440e62

# Diff at Tue, 15 Sep 2026 12:11:52 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a35dcf63dd3a2006e7759c0ac66a3c7d5e615ed9 block: 1788789718
- current timestamp: 1789471922

## Description

Three new ciphernodes registered and four operators activated in the bonding registry, each new operator posting the standard 32k FOLD bond. numActiveOperators 14 -> 19 out of 21 registered.

## Watched changes

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits.
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.17:
+        "eth:0x630B9c418aCb02829E34F2E0B7948b4A9c92e05F"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.18:
+        "eth:0xdBEd503093A01EA08f21144114542E53594536D6"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.19:
+        "eth:0x12c75ce176D5a58d2a72e85Af158Cbd8749fE1D8"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.20:
+        "eth:0x222D696D0242194457eD491b0c52aBbF9250342F"
+++ description: Number of operators whose active status is valid under the current eligibility-configuration version. Unlike activeOperators, this drops immediately when the version is bumped, so it is the signal for a mass invalidation.
      values.numActiveOperators:
-        14
+        19
    }
```

```diff
    EOA (eth:0x12c75ce176D5a58d2a72e85Af158Cbd8749fE1D8) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"member","from":"eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F","description":"submit one chosen eligible ticket per E3 sortition and be selected for ciphernode committee duties.","role":".activeOperators"}
    }
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider.
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.18:
+        "eth:0x630B9c418aCb02829E34F2E0B7948b4A9c92e05F"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.19:
+        "eth:0xdBEd503093A01EA08f21144114542E53594536D6"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.20:
+        "eth:0x222D696D0242194457eD491b0c52aBbF9250342F"
    }
```

Generated with discovered.json: 0x30ff4a57af617f6c15972893189c47530c07b2b6

# Diff at Mon, 07 Sep 2026 14:03:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@67fdb90ab08ace2a9b29f762ed2ddc4056f5d916 block: 1788273501
- current timestamp: 1788789718

## Description

Operator changes only. The protocol is still paused, while ciphernodes are bonding and registering. No request has been processed yet.

## Watched changes

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits.
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.13:
+        "eth:0xcb6ce8C3a16DeF797167e8A2aED7998A065f2513"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.14:
+        "eth:0x59461947EC279863138fae477C35B0c551A5c3a6"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.15:
+        "eth:0xBB3f49DED0EdE92ba3C9247A93E925770ac68671"
+++ description: Operator keys currently active under the collateral, release-attestation and ban rules, reconstructed from activation events. Eligibility-configuration bumps invalidate all cached statuses without emitting events, so entries here may still await re-activation.
      values.activeOperators.16:
+        "eth:0xe603c63ee0e97DA5a833B7498C366E88B9a5EBFe"
+++ description: Number of operators whose active status is valid under the current eligibility-configuration version. Unlike activeOperators, this drops immediately when the version is bumped, so it is the signal for a mass invalidation.
      values.numActiveOperators:
-        9
+        14
    }
```

```diff
    EOA (eth:0x2179a7A0bE3EB10c45A9aeec11F260E2bC4B1A7C) {
    +++ description: None
      receivedPermissions.1:
-        {"permission":"member","from":"eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7","description":"eligible for ticket-weighted selection into E3 committees, where selected members create key shares and participate in threshold decryption.","role":".$members"}
    }
```

```diff
    contract CiphernodeRegistry (eth:0xC927A5B2d8F68697bC28C0670df05178c93df2d7) [interfold/CiphernodeRegistry] {
    +++ description: Registry of ciphernodes and E3 committees. It performs ticket-weighted committee selection, records DKG (distributed key generation) proof anchors and the committee public key (to which cyphertexts can be encrypted), and tracks committee viability. Sortition entropy is supplied asynchronously by a governance-set randomness provider.
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.7:
-        "eth:0x2179a7A0bE3EB10c45A9aeec11F260E2bC4B1A7C"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.15:
+        "eth:0x59461947EC279863138fae477C35B0c551A5c3a6"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.16:
+        "eth:0xe603c63ee0e97DA5a833B7498C366E88B9a5EBFe"
+++ description: Current registered ciphernode operator keys reconstructed from add and remove events. For each E3, the active configuration selects three of these keys; $threshold applies to that selected committee, not to the full registry.
      values.$members.17:
+        "eth:0xBB3f49DED0EdE92ba3C9247A93E925770ac68671"
    }
```

```diff
    EOA (eth:0xcb6ce8C3a16DeF797167e8A2aED7998A065f2513) {
    +++ description: None
      receivedPermissions.0:
+        {"permission":"member","from":"eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F","description":"submit one chosen eligible ticket per E3 sortition and be selected for ciphernode committee duties.","role":".activeOperators"}
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1788273501 (main branch discovery), not current.

```diff
    contract BondingRegistry (eth:0x0ec90465095C21830BEcED07e032809A2Bd2915F) [interfold/BondingRegistry] {
    +++ description: Collateral registry for ciphernode operators. Operators become eligible by depositing ticket collateral backed by sUSDS and a FOLD bond, and by attesting a current software release in the NodeReleaseRegistry; the contract also enforces exits, committee obligations, bans and slashing debits.
      fieldMeta.bondOwners.description:
-        "Latest collateral owner for each operator key, reconstructed from ownership events. One address can own several operator positions."
+        "Latest collateral owner for each operator key, reconstructed from ownership events. The owner controls that operator's collateral and exits (operators self-administer this via propose/accept); one address can own several operator positions."
      fieldMeta.bondOwners.type:
-        "PERMISSION"
      fieldMeta.numActiveOperators.description:
-        "Number of operators whose active status is valid under the current eligibility-configuration version."
+        "Number of operators whose active status is valid under the current eligibility-configuration version. Unlike activeOperators, this drops immediately when the version is bumped, so it is the signal for a mass invalidation."
      fieldMeta.numRegisteredOperators:
+        {"description":"Number of operator keys with a registered collateral position."}
    }
```

```diff
-   Status: DELETED
    EOA (eth:0x0EebbDa2423b58e59Df0F4969e6Ce96af69BEFC3)
    +++ description: None
```

```diff
-   Status: DELETED
    EOA (eth:0x11E91FB4793047a68dFff29158387229eA313ffE)
    +++ description: None
```

```diff
-   Status: DELETED
    EOA (eth:0x2F3A1d13525748D2e6CC8EEA715CEFCF5B8ff833)
    +++ description: None
```

```diff
-   Status: DELETED
    EOA (eth:0x34aA3F359A9D614239015126635CE7732c18fDF3)
    +++ description: None
```

```diff
-   Status: DELETED
    EOA (eth:0x60Ca282757BA67f3aDbF21F3ba2eBe4Ab3eb01fc)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (eth:0x8B405dBf2F30844B608b08DaD20447A6955A6C6E) [GnosisSafe]
    +++ description: None
```

```diff
-   Status: DELETED
    EOA (eth:0x8d138c01765483cB79d787ce5933F609CbFDabcF)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (eth:0x97843608a00e2bbc75ab0C1911387E002565DEDE) [GnosisSafe]
    +++ description: None
```

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
