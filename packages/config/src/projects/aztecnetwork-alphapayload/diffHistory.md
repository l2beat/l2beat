Generated with discovered.json: 0xd2884699d4bd950fe84a8f8d3868ffca40856f38

# Diff at Fri, 06 Mar 2026 09:47:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@464f5fa94dac665b855f973e6cbee143f2fbb4bd block: 1772702345
- current timestamp: 1772790297

## Description

config related.

## Watched changes

```diff
    contract AlphaPayload (eth:0x780523FBa95e4Be0Fa09DA0fff5Fab3aBAE7B58e) {
    +++ description: The Alpha Upgrade Governance Payload encoding the recipe for bringing execution to the next Aztec rollup smart contract system.
      values.getActions.4.data:
-        "0x1ec82cb8000000000000000000000000a27ec0006e59f245217ff08cd52a7e8b169e62d2000000000000000000000000f1acfb0c6add7104e700b8fad3ea025dbb041f340000000000000000000000000000000000000000000066831d13e84649900000"
+        "0x1ec82cb8000000000000000000000000a27ec0006e59f245217ff08cd52a7e8b169e62d2000000000000000000000000f1acfb0c6add7104e700b8fad3ea025dbb041f3400000000000000000000000000000000000000000000659f6e5e74d408f00000"
    }
```

Generated with discovered.json: 0x1baddc5bf75259746f29033b2f69a97111e89f86

# Diff at Thu, 05 Mar 2026 11:17:32 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772702345

## Description

Initial disco for the alpha upgrade including the upgrade payload.

## Initial discovery

```diff
+   Status: CREATED
    reference Governance (eth:0x1102471Eb3378FEE427121c9EfcEa452E4B6B75e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RewardBooster (eth:0x1CbB707Bd7b4Fd2BcED6D96d84372fb428e93D80)
    +++ description: Calculates 'boosted' reward shares for active provers based on a configured curve, incentivizing consistent participation.
```

```diff
+   Status: CREATED
    contract FeeJuicePortal (eth:0x2891F8b941067F8B5a3F34545A30Cf71E3E23617)
    +++ description: One-way gas bridge: Escrows the fee asset (AZTEC) used to pay for L2 mana (gas). Users deposit tokens here, which are minted on L2 via the Inbox. The Rollup contract holds exclusive rights to withdraw tokens from this portal to distribute them as rewards to L1 sequencers and provers. Apart from that, this escrow does NOT afford a way to withdraw tokens.
```

```diff
+   Status: CREATED
    reference Registry (eth:0x35b22e09Ee0390539439E24f06Da43D83f90e298)
    +++ description: None
```

```diff
+   Status: CREATED
    reference RewardDistributor (eth:0x3D6A1B00C830C5f278FC5dFb3f6Ff0b74Db6dfe0)
    +++ description: None
```

```diff
+   Status: CREATED
    reference  (eth:0x4355415548584943414c4c490000000000000000)
    +++ description: None
```

```diff
+   Status: CREATED
    reference Rollup (eth:0x603bb2c05D474794ea97805e8De69bCcFb3bCA12)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Slasher (eth:0x64E6e9Bb9f1E33D319578B9f8a9C719Ca6D46eBb)
    +++ description: The executor contract for penalties. It receives authorization to slash validator stakes, subject to an execution delay and a vetoer.
```

```diff
+   Status: CREATED
    contract HonkVerifier (eth:0x70aEDda427f26480D240bc0f4308ceDec8d31348)
    +++ description: ZK proof verification contract.
```

```diff
+   Status: CREATED
    contract AlphaPayload (eth:0x780523FBa95e4Be0Fa09DA0fff5Fab3aBAE7B58e)
    +++ description: The Alpha Upgrade Governance Payload encoding the recipe for bringing execution to the next Aztec rollup smart contract system.
```

```diff
+   Status: CREATED
    contract FlushRewarder (eth:0x7C9a7130379F1B5dd6e7A53AF84fC0fE32267B65)
    +++ description: Incentivizes 'flushing' of the sequencer join queue. Flushing is needed to add sequencers to the active set at a preset rate limit and incurs gas costs. Adding one sequencer is rewarded by 100 AZTEC as long as supply lasts.
```

```diff
+   Status: CREATED
    contract EscapeHatch (eth:0x8c189ead28D5987A48e522162f9225124D50AD1B)
    +++ description: Provides a fallback mechanism for block production if the primary sequencer committee fails or censors. The committee is circumvented by allowing proposals by anyone who is able to post a large bond of 332,000,000 AZTEC. It maintains a set of bonded candidates and deterministically selects a designated proposer for a given 'hatch' period using RANDAO. If the designated proposer fails to propose and prove, their bond is slashed by 9,600,000 AZTEC. The escape hatch regularly opens every 112 epochs, given there are any bonded candidates.
```

```diff
+   Status: CREATED
    contract Inbox (eth:0x8Dbf0b6ed495baAb6062f5D5365aF3C1B2ed4578)
    +++ description: Facilitates canonical L1 to L2 communication. It accepts messages (including fee asset deposits) from L1, accumulates them in an append-only frontier tree per checkpoint, and forces the Sequencers and the Rollup contract to sequentially consume the roots of these message trees, ensuring message inclusion.
```

```diff
+   Status: CREATED
    reference AZTEC Token (eth:0xA27EC0006e59f245217Ff08CD52A7E8b169E62D2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TallySlashingProposer (eth:0xa4a38fD0108C00983E75616b638Ff3321FD26958)
    +++ description: Allows the validator committee to vote on slashing a specific peer. Once a quorum is reached, it proposes a slash action to the Slasher.
```

```diff
+   Status: CREATED
    reference GSE (eth:0xa92ecFD0E70c9cd5E5cd76c50Af0F7Da93567a4f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SlashPayloadCloneable (eth:0xAA43220b7eb7c8Ffe75bc9C483f3C07b0a55B445)
    +++ description: A template for specific slashing payload contracts deployed deterministically to encode a slashing action (who to slash and how much) that the Slasher executes.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xAe2001f7e21d5EcABf6234E9FDd1E76F50F74962)
    +++ description: Core rollup logic contract. It processes checkpoint proposals, verifies ZK proofs for state transitions, manages data availability, and coordinates validator selection and chain tip updates.
```

```diff
+   Status: CREATED
    reference Safe (eth:0xBbB4aF368d02827945748b28CD4b2D42e4A37480)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Outbox (eth:0xc9698B7AdEf9ee63F3Bf5cFF38086e4E836579f0)
    +++ description: Facilitates L2 to L1 communication. It stores the roots of L2 to L1 message trees per epoch, which are inserted by the Rollup contract. Users and portals can consume these messages on L1 by providing a Merkle proof against the stored root. A nullifier bitmap prevents double consumption.
```

```diff
+   Status: CREATED
    contract FlushRewarder (eth:0xf1AcfB0C6ADd7104e700b8FAd3Ea025dbB041F34)
    +++ description: Incentivizes 'flushing' of the sequencer join queue. Flushing is needed to add sequencers to the active set at a preset rate limit and incurs gas costs. Adding one sequencer is rewarded by 100 AZTEC as long as supply lasts.
```
