Generated with discovered.json: 0x6baaaa63caeed6259e0d811fce02148da6fedaec

# Diff at Wed, 26 Aug 2026 12:56:58 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fb74901bb22c00c7f3247db342eff035b686ebbd block: 1787653815
- current timestamp: 1787653815

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1787653815 (main branch discovery), not current.

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
