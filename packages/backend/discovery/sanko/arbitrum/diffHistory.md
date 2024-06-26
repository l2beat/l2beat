Generated with discovered.json: 0x5b31250b389a34ca80601f501b27781b7a781305

# Diff at Tue, 11 Jun 2024 13:11:14 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@4b482f34b787e8546115b599d38d66643fc47a24 block: 216537364
- current block number: 220737963

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 216537364 (main branch discovery), not current.

```diff
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159) {
    +++ description: State batches / commitments get posted here.
+++ description: Struct: delayBlocks, futureBlocks, delaySeconds, futureSeconds. onlyRollupOwner settable. Transactions can only be force-included after `delayBlocks` window (Sequencer-only) has passed.
      values.maxTimeVariation:
-        [17280,48,86400,3600]
+        {"delayBlocks":17280,"futureBlocks":48,"delaySeconds":86400,"futureSeconds":3600}
    }
```

Generated with discovered.json: 0xb8105dfaa96d42cb3168bb8035f98564cbe6a158

# Diff at Thu, 30 May 2024 08:36:56 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@8465affce30f3ceba1fcd6e8fe7a47fd51c7c62f block: 215641876
- current block number: 216537364

## Description

The Admin EOA is removed, Caldera MS is the only upgrade executor.

## Watched changes

```diff
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276) {
    +++ description: None
      values.accessControl.EXECUTOR_ROLE.members.1:
-        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
      values.accessControl.EXECUTOR_ROLE.members.0:
-        "0xe8216687Ef40C65F64D6dcd335b0aaab4A1Bc400"
+        "0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF"
    }
```

Generated with discovered.json: 0x4d6ff733355fea27e32d71c819ef65601a504b1b

# Diff at Mon, 27 May 2024 17:59:42 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- current block number: 215641876

## Description

Initial discovery: Orbit stack L3 with AnyTrust 1/1 DAC and ArbOS v10.2. Native L3 token is DMT.

## Initial discovery

```diff
+   Status: CREATED
    contract OneStepProverMemory (0x0aE035b3aAFFd8419d043920635Fe9CAdf179615)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorWalletCreator (0x0cB25fa1Bb1b12Ef908c09FD2d3C34f16F455DB3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ChallengeManager (0x1f269F38196484ef81e58C0144AaD2c5F6394bB4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x24B68936C13A414cd91437aE7AA730321B9ff159)
    +++ description: State batches / commitments get posted here.
```

```diff
+   Status: CREATED
    contract Bridge (0x2f285781B8d58678a3483de52D618198E4d27532)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20RollupEventInbox (0x365ce7234CE515c2e0139f3578b6c5989da1a863)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0x492c6278fea6b249F3A03672Ea1242fd6295fedA)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (0x575d32f7ff0C72921645e302cb14d2757E300786)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Caldera Multisig (0x6FD149B3d41fd860B9Da1A6fE54e902eF41F68BF)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x718E2a83775343d5c0B1eE0676703cBAF30CaFCD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x82d980E3f30E7c6EbD523AEdff2c0FaD3751b276)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitGatewayRouter (0x847186fbeEBf41eEe9c230360D0bF8585c0Db57B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverHostIo (0x8D90460169D34d34a441F765A246a3C7f54C77C1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RollupProxy (0x9A59EdF7080fdA05396373a85DdBf2cEBDB81Cd4)
    +++ description: Manages rollup components, list of Stakers and Validators. Entry point for Validators creating new Rollup Nodes (state commits) and Challengers submitting fraud proofs.
```

```diff
+   Status: CREATED
    contract ValidatorUtils (0x9e83136d4B3AD04C766591EA51712F9aEa3194C0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1OrbitERC20Gateway (0xb4951c0C41CFceB0D195A95FE66280457A80a990)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProofEntry (0xD16048EC58016FAbaC4d4E4C1203e49c0d9090E4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0xd18b1C6376633000c85541F7c15c591Ffe5f9556)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProver0 (0xd49141eB2c63D210b70542D6CE8453b049aab03A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OneStepProverMath (0xF07A4a947E1ca7B9e46D99Dbe625C30f5b60C706)
    +++ description: None
```
