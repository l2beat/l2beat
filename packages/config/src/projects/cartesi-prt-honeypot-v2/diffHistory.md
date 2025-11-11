Generated with discovered.json: 0x1f0912ba09a2bcec6926d870bc390f0f55564d6c

# Diff at Tue, 11 Nov 2025 14:39:44 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1762862346

## Description

Diff against honeypot v1:
- [Application](https://disco.l2beat.com/diff/eth:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c/eth:0xfDDF68726a28e418fA0c2a52c3134904a8c3e998): minimal changes, mainly formatting and casing, and a new field is added to track the number of "executed outputs". The template hash is different.
- [DaveConsensus](https://disco.l2beat.com/diff/eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68/eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259): new constants, new interface. The biggest change comes from the imported interface but very little of it is actually used.
- [InputBox](https://disco.l2beat.com/diff/eth:0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051/eth:0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac): aesthetic changes.
- [ERC20Portal](https://disco.l2beat.com/diff/eth:0xc700D6aDd016eECd59d989C028214Eaa0fCC0051/eth:0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D): aesthetic changes.
- [MultiLevelTournamentFactory](https://disco.l2beat.com/diff/eth:0xA31C2aCfF3464658866960c0fBD3d798310272D7/eth:0xa02997f69Dc5F1A727abE12ee36f87E28BBdEa6b): main change i notice is the additional of a `height` value in many functions.
- No significant changes in the Top/Middle/Bottom tournament factories.

## Initial discovery

```diff
+   Status: CREATED
    contract MiddleTournament (eth:0x0a88360f41D0f643ea63ade00c0A1a795395d2D9)
    +++ description: Handles the intermediate stages of a dispute following the TopTournament targeting a more granular bisection game.
```

```diff
+   Status: CREATED
    contract InputBox (eth:0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac)
    +++ description: Serves as both the canonical log for arbitrary dApp inputs and a portal for depositing assets (one possible type of input). It ensures data availability and that all off-chain participants process the same inputs in the same order.
```

```diff
+   Status: CREATED
    contract CartesiStateTransition (eth:0x31EEaeC2A8d855B13B376b72C172F0c20A2910F6)
    +++ description: Onchain verifier that can execute a single, disputed instruction of the Cartesi machine. It is the ultimate arbiter that BottomTournament calls to determine which party's claimed state transition is correct.
```

```diff
+   Status: CREATED
    contract TopTournament (eth:0x367Ff3c21E189645aaf17bDD41D4C186686CfE53)
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game.
```

```diff
+   Status: CREATED
    contract MiddleTournamentFactory (eth:0x47c7f40841F842f7691cB9Fd6Cd63673B79dCe79)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Cartesi Multisig (eth:0x60247492F1538Ed4520e61aE41ca2A8447592Ff5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BottomTournamentFactory (eth:0x6ccb8955afFA2aE4A88a4fC30916b41074d1F2B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiLevelTournamentFactory (eth:0xa02997f69Dc5F1A727abE12ee36f87E28BBdEa6b)
    +++ description: Responsible for creating and orchestrating the multi-stage dispute process. It instantiates the correct tournament contract (Top, Middle, or Bottom) depending on the current stage of the dispute game.
```

```diff
+   Status: CREATED
    contract ERC20Portal (eth:0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D)
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
```

```diff
+   Status: CREATED
    contract CanonicalTournamentParametersProvider (eth:0xc8d8639C3ec8925A00d4F262299807DC632c3113)
    +++ description: Provides constant configuration data for the tournament system. It defines parameters like the number of levels (3), the minimum challenge period of ~7d, and the size of computation segments at each stage of a dispute.
```

```diff
+   Status: CREATED
    contract BottomTournament (eth:0xe6B4444d324E0B403c9C43C5d7c8B2C3d5d02962)
    +++ description: Referees the dispute over a single contested Cartesi machine step as the final stage of arbitration in a dispute. It calls the CartesiStateTransition contract to get a definitive on-chain ruling and identify the winner.
```

```diff
+   Status: CREATED
    contract DaveConsensus (eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Application (eth:0xfDDF68726a28e418fA0c2a52c3134904a8c3e998)
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609`.
```

```diff
+   Status: CREATED
    contract TopTournamentFactory (eth:0xfdF16a7D9143f5E3B7B056b761a7eF8Ce18dc6eF)
    +++ description: None
```
