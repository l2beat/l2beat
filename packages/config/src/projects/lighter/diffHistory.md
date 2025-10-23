Generated with discovered.json: 0xf5429d0702d776d0b9671cac5d7c63a05ad28ecd

# Diff at Thu, 23 Oct 2025 12:50:06 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@57d3f180a9197fcc582bfc2d2856eea99da824cc block: 1760002018
- current timestamp: 1761223728

## Description

new markets.

## Watched changes

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      values.createdMarkets.26:
+        "XAU"
      values.createdMarkets.27:
+        "XAG"
      values.createdMarkets.28:
+        "MEGA"
    }
```

Generated with discovered.json: 0x6570333e6bb1aaa60eb91cc05ef1c55a0959caf2

# Diff at Thu, 09 Oct 2025 09:28:00 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@9abe3cb42f9d3939f748088a3ea4493deedf5239 block: 1759933041
- current timestamp: 1760002018

## Description

Updated config: added ignore in watch mode and high severity.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1759933041 (main branch discovery), not current.

```diff
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7) {
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
      fieldMeta:
+        {"verifier":{"severity":"HIGH"},"desertVerifier":{"severity":"HIGH"},"desertMode":{"severity":"HIGH"}}
    }
```

```diff
    contract UpgradeGatekeeper (eth:0x94da8A995D0D82Ef0fE7E509C6D76c22603B6f67) {
    +++ description: Governance contract functioning like an upgrade timelock for downstream contracts. The current delay is 21d and can be entirely skipped by eth:0x92b12c9d85BF7bd2EF5d2F53F4cd4Ce0BE432045.
      fieldMeta.getMaster:
+        {"severity":"HIGH"}
    }
```

```diff
    contract Governance (eth:0xa464DA0B43f80EE3FfC4795cbbFC78472b5c81A1) {
    +++ description: Manages the list of validators and the network governor.
      fieldMeta:
+        {"networkGovernor":{"severity":"HIGH"}}
    }
```

Generated with discovered.json: 0x598eaf5f3b133c1e44be4b23ebcdc2442d69ad57

# Diff at Wed, 08 Oct 2025 14:18:25 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1759933041

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract Lighter (eth:0x3B4D794a66304F130a4Db8F2551B0070dfCf5ca7)
    +++ description: The main rollup contract. It processes L2 batches, manages USDC deposits and withdrawals, allows users to submit censorship-resistant L2 transactions and controls desert mode (escape hatch). Logic is split between two contracts because of code-size limits, many operations are delegated to AdditionalZKLighter.
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
