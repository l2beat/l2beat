Generated with discovered.json: 0x3d49dee0a460da3def7c17cd404ea615a022e0a3

# Diff at Sun, 15 Jun 2025 12:06:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22709685

## Description

Provide description of changes. This section will be preserved.

## Initial discovery

```diff
+   Status: CREATED
    contract Application (0x4c1E74EF88a75C24e49eddD9f70D82A94D19251c)
    +++ description: Rollup app instance constract, responsible for holding assets and allowing the DApp to interact with other smart contracts.
```

```diff
+   Status: CREATED
    contract DaveConsensus (0x6CE590b9F0697327f18c601DF6f0baE4a0801B68)
    +++ description: Contract that manages PRT fraud-proof tournaments, managing application epochs and input validation, as well as settlement and challenge periods.
```

```diff
+   Status: CREATED
    contract MultiLevelTournamentFactory (0xA31C2aCfF3464658866960c0fBD3d798310272D7)
    +++ description: Contract that instantiates a PRT fraud-proof tournament, triggered every epoch.
```

```diff
+   Status: CREATED
    contract InputBox (0xc70074BDD26d8cF983Ca6A5b89b8db52D5850051)
    +++ description: Contract that receives arbitrary blobs as inputs to Cartesi DApps.
```

```diff
+   Status: CREATED
    contract ERC20Portal (0xc700D6aDd016eECd59d989C028214Eaa0fCC0051)
    +++ description: Contract that allows anyone to perform transfers of ERC-20 tokens to Cartesi DApps.
```

```diff
+   Status: CREATED
    contract TopTournament (0xDaa497885D83f345CBcbF071d7201230A8CBd68A)
    +++ description: None
```
