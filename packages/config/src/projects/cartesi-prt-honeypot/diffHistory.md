Generated with discovered.json: 0xd6922745a7e738d42fe92f9c61efe6cb68cd485d

# Diff at Mon, 01 Sep 2025 10:01:10 GMT:

Merge mark

Generated with discovered.json: 0x91fd6eec4386cdda35c23935bb149516e44b3f19

# Diff at Mon, 14 Jul 2025 12:44:51 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22732019
- current block number: 22732019

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22732019 (main branch discovery), not current.

```diff
    contract TopTournament (0x09114973AE4bf3Af3896E4e541082C73f224F8Aa) {
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game.
      address:
-        "0x09114973AE4bf3Af3896E4e541082C73f224F8Aa"
+        "eth:0x09114973AE4bf3Af3896E4e541082C73f224F8Aa"
      implementationNames.0x09114973AE4bf3Af3896E4e541082C73f224F8Aa:
-        "TopTournament"
      implementationNames.eth:0x09114973AE4bf3Af3896E4e541082C73f224F8Aa:
+        "TopTournament"
    }
```

```diff
    contract BottomTournament (0x18256941eC7B661F9F46C228b74e775b581e63f8) {
    +++ description: Referees the dispute over a single contested Cartesi machine step as the final stage of arbitration in a dispute. It calls the CartesiStateTransition contract to get a definitive on-chain ruling and identify the winner.
      address:
-        "0x18256941eC7B661F9F46C228b74e775b581e63f8"
+        "eth:0x18256941eC7B661F9F46C228b74e775b581e63f8"
      implementationNames.0x18256941eC7B661F9F46C228b74e775b581e63f8:
-        "BottomTournament"
      implementationNames.eth:0x18256941eC7B661F9F46C228b74e775b581e63f8:
+        "BottomTournament"
    }
```

```diff
    contract MiddleTournamentFactory (0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4) {
    +++ description: None
      address:
-        "0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4"
+        "eth:0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4"
      values.constructorArgs.impl:
-        "0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE"
+        "eth:0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE"
      implementationNames.0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4:
-        "MiddleTournamentFactory"
      implementationNames.eth:0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4:
+        "MiddleTournamentFactory"
    }
```

```diff
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c) {
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`.
      address:
-        "0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c"
+        "eth:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c"
      description:
-        "Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the 0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`."
+        "Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`."
      values.getOutputsMerkleRootValidator:
-        "0x6CE590b9F0697327f18c601DF6f0baE4a0801B68"
+        "eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68"
      values.owner:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.withdrawer:
-        "0x60247492F1538Ed4520e61aE41ca2A8447592Ff5"
+        "eth:0x60247492F1538Ed4520e61aE41ca2A8447592Ff5"
      implementationNames.0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c:
-        "Application"
      implementationNames.eth:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c:
+        "Application"
    }
```

```diff
    contract BottomTournamentFactory (0x4C7ab101e9B114A253475485b301E0D0c9e20647) {
    +++ description: None
      address:
-        "0x4C7ab101e9B114A253475485b301E0D0c9e20647"
+        "eth:0x4C7ab101e9B114A253475485b301E0D0c9e20647"
      values.constructorArgs.impl:
-        "0x18256941eC7B661F9F46C228b74e775b581e63f8"
+        "eth:0x18256941eC7B661F9F46C228b74e775b581e63f8"
      implementationNames.0x4C7ab101e9B114A253475485b301E0D0c9e20647:
-        "BottomTournamentFactory"
      implementationNames.eth:0x4C7ab101e9B114A253475485b301E0D0c9e20647:
+        "BottomTournamentFactory"
    }
```

```diff
    EOA  (0x53cfaE10bb087bd67288eCA9e7d58E216aEbD961) {
    +++ description: None
      address:
-        "0x53cfaE10bb087bd67288eCA9e7d58E216aEbD961"
+        "eth:0x53cfaE10bb087bd67288eCA9e7d58E216aEbD961"
    }
```

```diff
    contract Cartesi Multisig (0x60247492F1538Ed4520e61aE41ca2A8447592Ff5) {
    +++ description: None
      address:
-        "0x60247492F1538Ed4520e61aE41ca2A8447592Ff5"
+        "eth:0x60247492F1538Ed4520e61aE41ca2A8447592Ff5"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0xD91C0C2fC065a2e094129066D2683ef16E6F6032"
+        "eth:0xD91C0C2fC065a2e094129066D2683ef16E6F6032"
      values.$members.1:
-        "0x53cfaE10bb087bd67288eCA9e7d58E216aEbD961"
+        "eth:0x53cfaE10bb087bd67288eCA9e7d58E216aEbD961"
      values.$members.2:
-        "0xF4554F08Ed918893996DC36428Cb9DCbF2De990E"
+        "eth:0xF4554F08Ed918893996DC36428Cb9DCbF2De990E"
      values.$members.3:
-        "0xA7Dd0A6AF60ae9Accc7533d016dc7B68Db3324b1"
+        "eth:0xA7Dd0A6AF60ae9Accc7533d016dc7B68Db3324b1"
      values.$members.4:
-        "0xccD54bae0DfadA083F590f9aA16285f3eE4b5325"
+        "eth:0xccD54bae0DfadA083F590f9aA16285f3eE4b5325"
      values.$members.5:
-        "0xC826D6061b5C62237932c834B60a5eFf04D80F30"
+        "eth:0xC826D6061b5C62237932c834B60a5eFf04D80F30"
      implementationNames.0x60247492F1538Ed4520e61aE41ca2A8447592Ff5:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x60247492F1538Ed4520e61aE41ca2A8447592Ff5:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract DaveConsensus (0x6CE590b9F0697327f18c601DF6f0baE4a0801B68) {
    +++ description: Contract managing PRT fraud-proof tournaments, managing application epochs and input validation, as well as settlement and challenge periods. Dispute tournaments are started here and the final, verified computation result (as an `outputsMerkleRoot`) is recorded when they are resolved.
      address:
-        "0x6CE590b9F0697327f18c601DF6f0baE4a0801B68"
+        "eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68"
      values.getApplicationContract:
-        "0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c"
+        "eth:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c"
      values.getInputBox:
-        "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"
+        "eth:0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"
      values.getTournamentFactory:
-        "0xA31C2aCfF3464658866960c0fBD3d798310272D7"
+        "eth:0xA31C2aCfF3464658866960c0fBD3d798310272D7"
      implementationNames.0x6CE590b9F0697327f18c601DF6f0baE4a0801B68:
-        "DaveConsensus"
      implementationNames.eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68:
+        "DaveConsensus"
    }
```

```diff
    contract TopTournamentFactory (0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c) {
    +++ description: None
      address:
-        "0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c"
+        "eth:0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c"
      values.constructorArgs.impl:
-        "0x09114973AE4bf3Af3896E4e541082C73f224F8Aa"
+        "eth:0x09114973AE4bf3Af3896E4e541082C73f224F8Aa"
      implementationNames.0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c:
-        "TopTournamentFactory"
      implementationNames.eth:0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c:
+        "TopTournamentFactory"
    }
```

```diff
    contract CartesiStateTransition (0x772732EFbDE6559B2960327276ed33d707fF057f) {
    +++ description: Onchain verifier that can execute a single, disputed instruction of the Cartesi machine. It is the ultimate arbiter that BottomTournament calls to determine which party's claimed state transition is correct.
      address:
-        "0x772732EFbDE6559B2960327276ed33d707fF057f"
+        "eth:0x772732EFbDE6559B2960327276ed33d707fF057f"
      implementationNames.0x772732EFbDE6559B2960327276ed33d707fF057f:
-        "CartesiStateTransition"
      implementationNames.eth:0x772732EFbDE6559B2960327276ed33d707fF057f:
+        "CartesiStateTransition"
    }
```

```diff
    contract MultiLevelTournamentFactory (0xA31C2aCfF3464658866960c0fBD3d798310272D7) {
    +++ description: Responsible for creating and orchestrating the multi-stage dispute process. It instantiates the correct tournament contract (Top, Middle, or Bottom) depending on the current stage of the dispute game.
      address:
-        "0xA31C2aCfF3464658866960c0fBD3d798310272D7"
+        "eth:0xA31C2aCfF3464658866960c0fBD3d798310272D7"
      values.constructorArgs._topFactory:
-        "0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c"
+        "eth:0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c"
      values.constructorArgs._middleFactory:
-        "0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4"
+        "eth:0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4"
      values.constructorArgs._bottomFactory:
-        "0x4C7ab101e9B114A253475485b301E0D0c9e20647"
+        "eth:0x4C7ab101e9B114A253475485b301E0D0c9e20647"
      values.constructorArgs._tournamentParametersProvider:
-        "0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c"
+        "eth:0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c"
      values.constructorArgs._stateTransition:
-        "0x772732EFbDE6559B2960327276ed33d707fF057f"
+        "eth:0x772732EFbDE6559B2960327276ed33d707fF057f"
      implementationNames.0xA31C2aCfF3464658866960c0fBD3d798310272D7:
-        "MultiLevelTournamentFactory"
      implementationNames.eth:0xA31C2aCfF3464658866960c0fBD3d798310272D7:
+        "MultiLevelTournamentFactory"
    }
```

```diff
    EOA  (0xA7Dd0A6AF60ae9Accc7533d016dc7B68Db3324b1) {
    +++ description: None
      address:
-        "0xA7Dd0A6AF60ae9Accc7533d016dc7B68Db3324b1"
+        "eth:0xA7Dd0A6AF60ae9Accc7533d016dc7B68Db3324b1"
    }
```

```diff
    contract InputBox (0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051) {
    +++ description: Serves as both the canonical log for arbitrary dApp inputs and a portal for depositing assets (one possible type of input). It ensures data availability and that all off-chain participants process the same inputs in the same order.
      address:
-        "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"
+        "eth:0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"
      implementationNames.0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051:
-        "InputBox"
      implementationNames.eth:0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051:
+        "InputBox"
    }
```

```diff
    contract ERC20Portal (0xc700D6aDd016eECd59d989C028214Eaa0fCC0051) {
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
      address:
-        "0xc700D6aDd016eECd59d989C028214Eaa0fCC0051"
+        "eth:0xc700D6aDd016eECd59d989C028214Eaa0fCC0051"
      values.getInputBox:
-        "0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"
+        "eth:0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051"
      implementationNames.0xc700D6aDd016eECd59d989C028214Eaa0fCC0051:
-        "ERC20Portal"
      implementationNames.eth:0xc700D6aDd016eECd59d989C028214Eaa0fCC0051:
+        "ERC20Portal"
    }
```

```diff
    EOA  (0xC826D6061b5C62237932c834B60a5eFf04D80F30) {
    +++ description: None
      address:
-        "0xC826D6061b5C62237932c834B60a5eFf04D80F30"
+        "eth:0xC826D6061b5C62237932c834B60a5eFf04D80F30"
    }
```

```diff
    contract CanonicalTournamentParametersProvider (0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c) {
    +++ description: Provides constant configuration data for the tournament system. It defines parameters like the number of levels (3), the minimum challenge period of ~7d, and the size of computation segments at each stage of a dispute.
      address:
-        "0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c"
+        "eth:0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c"
      implementationNames.0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c:
-        "CanonicalTournamentParametersProvider"
      implementationNames.eth:0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c:
+        "CanonicalTournamentParametersProvider"
    }
```

```diff
    EOA  (0xccD54bae0DfadA083F590f9aA16285f3eE4b5325) {
    +++ description: None
      address:
-        "0xccD54bae0DfadA083F590f9aA16285f3eE4b5325"
+        "eth:0xccD54bae0DfadA083F590f9aA16285f3eE4b5325"
    }
```

```diff
    EOA  (0xD91C0C2fC065a2e094129066D2683ef16E6F6032) {
    +++ description: None
      address:
-        "0xD91C0C2fC065a2e094129066D2683ef16E6F6032"
+        "eth:0xD91C0C2fC065a2e094129066D2683ef16E6F6032"
    }
```

```diff
    contract MiddleTournament (0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE) {
    +++ description: Handles the intermediate stages of a dispute following the TopTournament targeting a more granular bisection game.
      address:
-        "0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE"
+        "eth:0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE"
      implementationNames.0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE:
-        "MiddleTournament"
      implementationNames.eth:0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE:
+        "MiddleTournament"
    }
```

```diff
    EOA  (0xF4554F08Ed918893996DC36428Cb9DCbF2De990E) {
    +++ description: None
      address:
-        "0xF4554F08Ed918893996DC36428Cb9DCbF2De990E"
+        "eth:0xF4554F08Ed918893996DC36428Cb9DCbF2De990E"
    }
```

```diff
+   Status: CREATED
    contract TopTournament (0x09114973AE4bf3Af3896E4e541082C73f224F8Aa)
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game.
```

```diff
+   Status: CREATED
    contract BottomTournament (0x18256941eC7B661F9F46C228b74e775b581e63f8)
    +++ description: Referees the dispute over a single contested Cartesi machine step as the final stage of arbitration in a dispute. It calls the CartesiStateTransition contract to get a definitive on-chain ruling and identify the winner.
```

```diff
+   Status: CREATED
    contract MiddleTournamentFactory (0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c)
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the eth:0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`.
```

```diff
+   Status: CREATED
    contract BottomTournamentFactory (0x4C7ab101e9B114A253475485b301E0D0c9e20647)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Cartesi Multisig (0x60247492F1538Ed4520e61aE41ca2A8447592Ff5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DaveConsensus (0x6CE590b9F0697327f18c601DF6f0baE4a0801B68)
    +++ description: Contract managing PRT fraud-proof tournaments, managing application epochs and input validation, as well as settlement and challenge periods. Dispute tournaments are started here and the final, verified computation result (as an `outputsMerkleRoot`) is recorded when they are resolved.
```

```diff
+   Status: CREATED
    contract TopTournamentFactory (0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CartesiStateTransition (0x772732EFbDE6559B2960327276ed33d707fF057f)
    +++ description: Onchain verifier that can execute a single, disputed instruction of the Cartesi machine. It is the ultimate arbiter that BottomTournament calls to determine which party's claimed state transition is correct.
```

```diff
+   Status: CREATED
    contract MultiLevelTournamentFactory (0xA31C2aCfF3464658866960c0fBD3d798310272D7)
    +++ description: Responsible for creating and orchestrating the multi-stage dispute process. It instantiates the correct tournament contract (Top, Middle, or Bottom) depending on the current stage of the dispute game.
```

```diff
+   Status: CREATED
    contract InputBox (0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051)
    +++ description: Serves as both the canonical log for arbitrary dApp inputs and a portal for depositing assets (one possible type of input). It ensures data availability and that all off-chain participants process the same inputs in the same order.
```

```diff
+   Status: CREATED
    contract ERC20Portal (0xc700D6aDd016eECd59d989C028214Eaa0fCC0051)
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
```

```diff
+   Status: CREATED
    contract CanonicalTournamentParametersProvider (0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c)
    +++ description: Provides constant configuration data for the tournament system. It defines parameters like the number of levels (3), the minimum challenge period of ~7d, and the size of computation segments at each stage of a dispute.
```

```diff
+   Status: CREATED
    contract MiddleTournament (0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE)
    +++ description: Handles the intermediate stages of a dispute following the TopTournament targeting a more granular bisection game.
```

Generated with discovered.json: 0x6ff852eada57af8405286ffcd439a0c1f9236524

# Diff at Fri, 04 Jul 2025 12:18:55 GMT:

- chain: ethereum
- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22732019
- current block number: 22732019

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22732019 (main branch discovery), not current.

```diff
    contract Cartesi Multisig (0x60247492F1538Ed4520e61aE41ca2A8447592Ff5) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c"
+        "eth:0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c"
    }
```

Generated with discovered.json: 0xde17cc07cc9b72d0da01196f068c630f0df9444e

# Diff at Wed, 18 Jun 2025 14:39:58 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a8e4f22a1441bd5040898cc3d3d62b3582942b65 block: 22729814
- current block number: 22732019

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22729814 (main branch discovery), not current.

```diff
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c) {
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the 0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`.
      description:
-        "Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the 0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions."
+        "Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the 0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions. The immutable template hash of the dApp is `0x615acc9fb8ae058d0e45c0d12fa10e1a6c9e645222c6fd94dfeda194ee427c14`."
    }
```

Generated with discovered.json: 0xdfb0cba8bf48c9a310197d5ff1ca4ab0215fb281

# Diff at Wed, 18 Jun 2025 07:22:47 GMT:

- chain: ethereum
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@d9956601c9039d7a0c20705676b0997fa01d0250 block: 22717520
- current block number: 22729814

## Description

add cartesi multisig withdrawer permission.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22717520 (main branch discovery), not current.

```diff
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c) {
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the 0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions.
      values.withdrawer:
+        "0x60247492F1538Ed4520e61aE41ca2A8447592Ff5"
    }
```

```diff
+   Status: CREATED
    contract Cartesi Multisig (0x60247492F1538Ed4520e61aE41ca2A8447592Ff5)
    +++ description: None
```

Generated with discovered.json: 0xdb7b65667f80e7bb2b884fdde74478cda930ee9b

# Diff at Tue, 17 Jun 2025 15:28:30 GMT:

- chain: ethereum
- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22717520

## Description

Initial cartesi fault proofs discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract TopTournament (0x09114973AE4bf3Af3896E4e541082C73f224F8Aa)
    +++ description: Represents the entry point and highest level of a dispute in PRT. Disagreeing validators join this tournament to resolve conflicts over the entire computation trace through a bisection game.
```

```diff
+   Status: CREATED
    contract BottomTournament (0x18256941eC7B661F9F46C228b74e775b581e63f8)
    +++ description: Referees the dispute over a single contested Cartesi machine step as the final stage of arbitration in a dispute. It calls the CartesiStateTransition contract to get a definitive on-chain ruling and identify the winner.
```

```diff
+   Status: CREATED
    contract MiddleTournamentFactory (0x2B3272E7Bcf06d36b9A902dfc0dD0d9384F2A4c4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c)
    +++ description: Main dApp contract that escrows assets and executes the verified results (outputs) from off-chain computation. It relies on the 0x6CE590b9F0697327f18c601DF6f0baE4a0801B68 contract to validate outputs before releasing assets or triggering on-chain actions.
```

```diff
+   Status: CREATED
    contract BottomTournamentFactory (0x4C7ab101e9B114A253475485b301E0D0c9e20647)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DaveConsensus (0x6CE590b9F0697327f18c601DF6f0baE4a0801B68)
    +++ description: Contract managing PRT fraud-proof tournaments, managing application epochs and input validation, as well as settlement and challenge periods. Dispute tournaments are started here and the final, verified computation result (as an `outputsMerkleRoot`) is recorded when they are resolved.
```

```diff
+   Status: CREATED
    contract TopTournamentFactory (0x71C6A5fF7f4f31451CcB5bE312Fa1C5F2a060d5c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CartesiStateTransition (0x772732EFbDE6559B2960327276ed33d707fF057f)
    +++ description: Onchain verifier that can execute a single, disputed instruction of the Cartesi machine. It is the ultimate arbiter that BottomTournament calls to determine which party's claimed state transition is correct.
```

```diff
+   Status: CREATED
    contract MultiLevelTournamentFactory (0xA31C2aCfF3464658866960c0fBD3d798310272D7)
    +++ description: Responsible for creating and orchestrating the multi-stage dispute process. It instantiates the correct tournament contract (Top, Middle, or Bottom) depending on the current stage of the dispute game.
```

```diff
+   Status: CREATED
    contract InputBox (0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051)
    +++ description: Serves as both the canonical log for arbitrary dApp inputs and a portal for depositing assets (one possible type of input). It ensures data availability and that all off-chain participants process the same inputs in the same order.
```

```diff
+   Status: CREATED
    contract ERC20Portal (0xc700D6aDd016eECd59d989C028214Eaa0fCC0051)
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
```

```diff
+   Status: CREATED
    contract CanonicalTournamentParametersProvider (0xcC0a49320891Bf35bca834aF1045ab89Ecd44c0c)
    +++ description: Provides constant configuration data for the tournament system. It defines parameters like the number of levels (3), the minimum challenge period of ~7d, and the size of computation segments at each stage of a dispute.
```

```diff
+   Status: CREATED
    contract MiddleTournament (0xe49E4CB0Ab5c0E5792E762807329B420Cc4FF1AE)
    +++ description: Handles the intermediate stages of a dispute following the TopTournament targeting a more granular bisection game.
```

