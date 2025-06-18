Generated with discovered.json: 0x3af2da1734b02af6c3cc5d679aaeea221a4be061

# Diff at Wed, 18 Jun 2025 07:22:47 GMT:

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

- author: Luca Donno (<donnoh99@gmail.com>)
- current block number: 22717520

## Description

Initial cartesi fault proofs disco.

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
