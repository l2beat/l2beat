Generated with discovered.json: 0xe983fda1f381c8f01cdc014ab5e0891b4db39e29

# Diff at Fri, 08 May 2026 07:51:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1765380759
- current timestamp: 1765380759

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765380759 (main branch discovery), not current.

```diff
    contract MiddleTournament (eth:0x0a88360f41D0f643ea63ade00c0A1a795395d2D9) [cartesi/MiddleTournament_clone] {
    +++ description: Handles the intermediate stages of a dispute following the TopTournament targeting a more granular bisection game.
      sourceHashes.0:
-        "0xc8a4de8f0bd4227203c659054d07e5fa9d219e2368a08706eaa6c3158e5eb18f"
+        "0x8517ec72b1d230916b763b25a18ab7bbeecbc518b3424a02b7e00befbddc5734"
    }
```

```diff
    contract InputBox (eth:0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac) [cartesi/InputBox] {
    +++ description: Serves as both the canonical log for arbitrary dApp inputs and a portal for depositing assets (one possible type of input). It ensures data availability and that all off-chain participants process the same inputs in the same order.
      sourceHashes.0:
-        "0x9666c4a510c5491dc54f36666f93eea759e234b0459494dfb5b9f2f9cc5bff21"
+        "0xbe57989f7098203046dc737e4500618a9cef044791563d85a41ddc38d86d9a4f"
    }
```

```diff
    contract CartesiStateTransition (eth:0x31EEaeC2A8d855B13B376b72C172F0c20A2910F6) [cartesi/CartesiStateTransition] {
    +++ description: Onchain verifier that can execute a single, disputed instruction of the Cartesi machine. It is the ultimate arbiter that BottomTournament calls to determine which party's claimed state transition is correct.
      sourceHashes.0:
-        "0xd7ac00e8f86fd3a5a23b988ac1e1b7fee0e33c3e7da7fe9d052cf59d3d0350b8"
+        "0xfe97214cf7ff781796de8d352e12146ee3ad0f84521e9c49511b949a70185ee6"
    }
```

```diff
    contract TopTournament (eth:0x367Ff3c21E189645aaf17bDD41D4C186686CfE53) [cartesi/TopTournament_clone] {
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game.
      sourceHashes.0:
-        "0x70778e9754ab74f6e22ac503e0ff09adde5117c89924e9f3e6be192af3680e18"
+        "0x8f78041011dbf326b7a06e20a20284df346043f1343cdf4e91e8e50f3e95a535"
    }
```

```diff
    contract MiddleTournamentFactory (eth:0x47c7f40841F842f7691cB9Fd6Cd63673B79dCe79) [cartesi/MiddleTournamentFactory] {
    +++ description: None
      sourceHashes.0:
-        "0x29a5c1acbe48ac90aa8c32546a01e4b2a147c79d78ae5b8faf4c08f04481db3b"
+        "0xeb7fc0f4a375b9cf3c1468aacfebfe761d71625cc5e0420953dc7ce4a152db3d"
    }
```

```diff
    contract Cartesi Multisig (eth:0x60247492F1538Ed4520e61aE41ca2A8447592Ff5) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract BottomTournamentFactory (eth:0x6ccb8955afFA2aE4A88a4fC30916b41074d1F2B6) [cartesi/BottomTournamentFactory] {
    +++ description: None
      sourceHashes.0:
-        "0x891cb41f153a71a8aa561434276f941f427520fda41f0f7c44d12ba6837e6c13"
+        "0xfa803cae35a3c7e8d516bbbc0918866fd523067f0727a6c16e98cdea74f9dcce"
    }
```

```diff
    contract MultiLevelTournamentFactory (eth:0xa02997f69Dc5F1A727abE12ee36f87E28BBdEa6b) [cartesi/MultiLevelTournamentFactory] {
    +++ description: Responsible for creating and orchestrating the multi-stage dispute process. It instantiates the correct tournament contract (Top, Middle, or Bottom) depending on the current stage of the dispute game.
      sourceHashes.0:
-        "0x25a073fa8192c05534ce1d9d90a1465b618ee932fc4583710d357ffd10954bbb"
+        "0x42d1c7c776bc5a10e5d918656492e43438932a2bcb224e59e6f87a9b5b9ba6ad"
    }
```

```diff
    contract TopTournament_example (eth:0xA2835312696Afa86c969e40831857dbB1412627f) [cartesi/TopTournament] {
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game. The required bond amount for joining the Tournament is calculated from worst case gas estimates and currently is 0.23219805 ETH.
      sourceHashes.0:
-        "0x70778e9754ab74f6e22ac503e0ff09adde5117c89924e9f3e6be192af3680e18"
+        "0x8f78041011dbf326b7a06e20a20284df346043f1343cdf4e91e8e50f3e95a535"
      sourceHashes.1:
-        "0x70778e9754ab74f6e22ac503e0ff09adde5117c89924e9f3e6be192af3680e18"
+        "0x8f78041011dbf326b7a06e20a20284df346043f1343cdf4e91e8e50f3e95a535"
    }
```

```diff
    contract ERC20Portal (eth:0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D) [cartesi/ERC20Portal] {
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
      sourceHashes.0:
-        "0xd247a27e2ff1305d4e59398e751d29f123c3cdaee809316af6ffa7e040d37dcf"
+        "0x5a519533537b927e160528d0390dfeb1590890f0f4b65969567db8bde3b65dd4"
    }
```

```diff
    contract CanonicalTournamentParametersProvider (eth:0xc8d8639C3ec8925A00d4F262299807DC632c3113) [cartesi/CanonicalTournamentParametersProvider] {
    +++ description: Provides constant configuration data for the tournament system. It defines parameters like the number of levels (3), the minimum challenge period of ~7d, and the size of computation segments at each stage of a dispute.
      sourceHashes.0:
-        "0x9dbc469370fa5c8a907d7dcced0b3f2bb5509cb20dc46d9433a44f5f77be4128"
+        "0x9c0867836a0d04ba2719643f629eb48a6ece90ddf802d1bc437a2429b2796abd"
    }
```

```diff
    contract BottomTournament (eth:0xe6B4444d324E0B403c9C43C5d7c8B2C3d5d02962) [cartesi/BottomTournament_clone] {
    +++ description: Referees the dispute over a single contested Cartesi machine step as the final stage of arbitration in a dispute. It calls the CartesiStateTransition contract to get a definitive on-chain ruling and identify the winner.
      sourceHashes.0:
-        "0x560658f241ee1523cfa020a0cd045514b915a18257c4df584af7846ed705162e"
+        "0x8cb03766c48d73b034bbb724800a968db36090f8864c3358b73314949b9b3f38"
    }
```

```diff
    contract DaveConsensus (eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259) [cartesi/DaveConsensus] {
    +++ description: Contract managing PRT fraud-proof tournaments, application epochs and input validation, as well as settlement and challenge periods. Dispute tournaments are started here and the final, verified computation result (as an `outputsMerkleRoot`) is recorded when they are resolved.
      sourceHashes.0:
-        "0x8ac2d62859fb202129c58e8e04fab24de739b3f91de2dec7c98c012ad2466e89"
+        "0x0591357e19f3506f31b61770ad435f01d87a06f47a06414041976c7f4e95a9a6"
    }
```

```diff
    contract Application (eth:0xfDDF68726a28e418fA0c2a52c3134904a8c3e998) [cartesi/Application] {
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609`.
      sourceHashes.0:
-        "0x9a732e55de9aeae2ead7314600feb957c1d7d92daaac68f6d61fdcf0e3bbed2d"
+        "0x864b35ad1132c5889d6b57001dd402c40280800647b096f91d7f4f8f049d0168"
    }
```

```diff
    contract TopTournamentFactory (eth:0xfdF16a7D9143f5E3B7B056b761a7eF8Ce18dc6eF) [cartesi/TopTournamentFactory] {
    +++ description: None
      sourceHashes.0:
-        "0x28d0c882215531e4b36ca8c7570bf961b1065c0e6e8fd2f7201de3ba5cbd245c"
+        "0xf25beacda3696c357c20adb09a4ee0e424ff98c1c2020fb99cb67853db32ff80"
    }
```

Generated with discovered.json: 0xf5361750543263058a40c79a2d03961475615be0

# Diff at Tue, 05 May 2026 10:22:02 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1765380759
- current timestamp: 1765380759

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1765380759 (main branch discovery), not current.

```diff
    contract MiddleTournament (eth:0x0a88360f41D0f643ea63ade00c0A1a795395d2D9) {
    +++ description: Handles the intermediate stages of a dispute following the TopTournament targeting a more granular bisection game.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract InputBox (eth:0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac) {
    +++ description: Serves as both the canonical log for arbitrary dApp inputs and a portal for depositing assets (one possible type of input). It ensures data availability and that all off-chain participants process the same inputs in the same order.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract CartesiStateTransition (eth:0x31EEaeC2A8d855B13B376b72C172F0c20A2910F6) {
    +++ description: Onchain verifier that can execute a single, disputed instruction of the Cartesi machine. It is the ultimate arbiter that BottomTournament calls to determine which party's claimed state transition is correct.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract TopTournament (eth:0x367Ff3c21E189645aaf17bDD41D4C186686CfE53) {
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract MiddleTournamentFactory (eth:0x47c7f40841F842f7691cB9Fd6Cd63673B79dCe79) {
    +++ description: None
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract Cartesi Multisig (eth:0x60247492F1538Ed4520e61aE41ca2A8447592Ff5) {
    +++ description: None
      deployerAddress:
+        "eth:0x77eBA70fe27aC8BA1f292bDa9108555e9a065e3b"
    }
```

```diff
    contract BottomTournamentFactory (eth:0x6ccb8955afFA2aE4A88a4fC30916b41074d1F2B6) {
    +++ description: None
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract MultiLevelTournamentFactory (eth:0xa02997f69Dc5F1A727abE12ee36f87E28BBdEa6b) {
    +++ description: Responsible for creating and orchestrating the multi-stage dispute process. It instantiates the correct tournament contract (Top, Middle, or Bottom) depending on the current stage of the dispute game.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract TopTournament_example (eth:0xA2835312696Afa86c969e40831857dbB1412627f) {
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game. The required bond amount for joining the Tournament is calculated from worst case gas estimates and currently is 0.23219805 ETH.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract ERC20Portal (eth:0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D) {
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract CanonicalTournamentParametersProvider (eth:0xc8d8639C3ec8925A00d4F262299807DC632c3113) {
    +++ description: Provides constant configuration data for the tournament system. It defines parameters like the number of levels (3), the minimum challenge period of ~7d, and the size of computation segments at each stage of a dispute.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract BottomTournament (eth:0xe6B4444d324E0B403c9C43C5d7c8B2C3d5d02962) {
    +++ description: Referees the dispute over a single contested Cartesi machine step as the final stage of arbitration in a dispute. It calls the CartesiStateTransition contract to get a definitive on-chain ruling and identify the winner.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract DaveConsensus (eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259) {
    +++ description: Contract managing PRT fraud-proof tournaments, application epochs and input validation, as well as settlement and challenge periods. Dispute tournaments are started here and the final, verified computation result (as an `outputsMerkleRoot`) is recorded when they are resolved.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract Application (eth:0xfDDF68726a28e418fA0c2a52c3134904a8c3e998) {
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609`.
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

```diff
    contract TopTournamentFactory (eth:0xfdF16a7D9143f5E3B7B056b761a7eF8Ce18dc6eF) {
    +++ description: None
      deployerAddress:
+        "eth:0x0e28A8f88C6266dF0FE274c15c1d4b27f8B373C0"
    }
```

Generated with discovered.json: 0x1e9138497f63332bb00d490ec8cfaa9a8b8d38a8

# Diff at Wed, 10 Dec 2025 15:33:43 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@87479478fee0d2fb1eb3c2a36f88a2ceeb4087df block: 1763109405
- current timestamp: 1765380759

## Description

The example tournament has concluded. Nothing to see.

## Watched changes

```diff
    contract TopTournament_example (eth:0xA2835312696Afa86c969e40831857dbB1412627f) {
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game. The required bond amount for joining the Tournament is calculated from worst case gas estimates and currently is 0.23219805 ETH.
      values.arbitrationResult.0:
-        false
+        true
      values.arbitrationResult.1:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0xb24767473a260dd656044e7302fc47c52e2d93ce0f3ffb58668b6dcc95e11880"
      values.arbitrationResult.2:
-        "0x0000000000000000000000000000000000000000000000000000000000000000"
+        "0x144d45af1181b35f2b11c4b1150d6cb16934c28093707fb97c911ff16b3fe609"
      values.isClosed:
-        false
+        true
      values.isFinished:
-        false
+        true
      values.timeFinished.0:
-        false
+        true
      values.timeFinished.1:
-        0
+        23801750
    }
```

Generated with discovered.json: 0x033268aecee486847bddf861b53c271e24e93c58

# Diff at Fri, 14 Nov 2025 11:18:55 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1763109405

## Description

Diff against honeypot v1:
- [Application](https://disco.l2beat.com/diff/eth:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c/eth:0xfDDF68726a28e418fA0c2a52c3134904a8c3e998): minimal changes, mainly formatting and casing, and a new field is added to track the number of "executed outputs". The template hash is different.
- [DaveConsensus](https://disco.l2beat.com/diff/eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68/eth:0xF0D8374F8446E87e013Ec1435C7245E05f439259): new constants, new interface. The biggest change comes from the imported interface but very little of it is actually used.
- [InputBox](https://disco.l2beat.com/diff/eth:0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051/eth:0x1b51e2992A2755Ba4D6F7094032DF91991a0Cfac): aesthetic changes.
- [ERC20Portal](https://disco.l2beat.com/diff/eth:0xc700D6aDd016eECd59d989C028214Eaa0fCC0051/eth:0xACA6586A0Cf05bD831f2501E7B4aea550dA6562D): aesthetic changes.
- [MultiLevelTournamentFactory](https://disco.l2beat.com/diff/eth:0xA31C2aCfF3464658866960c0fBD3d798310272D7/eth:0xa02997f69Dc5F1A727abE12ee36f87E28BBdEa6b): main change i notice is the additional of a `height` value in many functions.
- [BottomTournament](https://disco.l2beat.com/diff/eth:0x18256941eC7B661F9F46C228b74e775b581e63f8/eth:0xe6B4444d324E0B403c9C43C5d7c8B2C3d5d02962)
- [MiddleTournament](https://disco.l2beat.com/diff/eth:0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE/eth:0x0a88360f41D0f643ea63ade00c0A1a795395d2D9)
- [TopTournament](https://disco.l2beat.com/diff/eth:0x09114973AE4bf3Af3896E4e541082C73f224F8Aa/eth:0x367Ff3c21E189645aaf17bDD41D4C186686CfE53): obligatory bondValue added (gas dependent) that must be paid on joinTournament(), can be used for gas refunds and be claimed by tournament winner
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
    contract TopTournament_example (eth:0xA2835312696Afa86c969e40831857dbB1412627f)
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game. The required bond amount for joining the Tournament is calculated from worst case gas estimates and currently is 0.23219805 ETH.
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
    +++ description: Contract managing PRT fraud-proof tournaments, application epochs and input validation, as well as settlement and challenge periods. Dispute tournaments are started here and the final, verified computation result (as an `outputsMerkleRoot`) is recorded when they are resolved.
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
