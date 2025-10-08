Generated with discovered.json: 0x3964bf96338b0d03319a82c9e7d4ae77e0766d3a

# Diff at Wed, 08 Oct 2025 13:30:28 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1759911325

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7)
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistnant L2 transactions and controls desert mode (recovery mode). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
```

```diff
+   Status: CREATED
    contract DesertVerifier (eth:0x59406a5DcE71a4f631F9cd5D41996a19D6fDF184)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lighter Multisig (eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67)
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
```

```diff
+   Status: CREATED
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1)
    +++ description: Manages the list of validators and the network governor.
```

```diff
+   Status: CREATED
    contract ZkLighterVerifier (eth:0xac3Ce44B6ff4E402858C99D5699ff63131572BaA)
    +++ description: The main ZK verifier of Lighter, settles the proofs of correct L2 state transition in the case of normal rollup operation.
```
