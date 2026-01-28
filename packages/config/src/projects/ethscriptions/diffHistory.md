Generated with discovered.json: 0x4f394ef95bd6a8faed461ed4253206245cd70025

# Diff at Wed, 28 Jan 2026 11:58:54 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@c9622efccc03e90f3e3da4283b4873ee6b8197d6 block: 1768395715
- current timestamp: 1769601454

## Description

Discovery rerun after cache override.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1768395715 (main branch discovery), not current.

```diff
    contract EthscriptionsProver (ethscr:0x3300000000000000000000000000000000000003) {
    +++ description: L2 predeploy that automatically sends ethscription state snapshots to L1 via the L2ToL1MessagePasser whenever an ethscription is created or transferred.
      sourceHashes.0:
-        "0xa20aefed1e9e4886d8048e954bbc525daabd6ee73cb68eb22485144f5b7e64e0"
+        "0x8a450a4702d14921f51f4bc045204cb9ef401b919b47bc4ff16ffe47387111c6"
      implementationNames.ethscr:0x3300000000000000000000000000000000000003:
-        "EthscriptionsProver"
+        "Proxy"
    }
```

```diff
    contract Proxy (ethscr:0x4200000000000000000000000000000000000018) {
    +++ description: ProxyAdmin predeploy that manages proxy upgrades for L2 predeploys.
      name:
-        "ProxyAdmin"
+        "Proxy"
      sourceHashes.0:
-        "0xa30dbc60acedeaa7e8154c11b75935442af967787bea59f73fe85e96780a15e6"
+        "0x8a450a4702d14921f51f4bc045204cb9ef401b919b47bc4ff16ffe47387111c6"
      values.owner:
-        "ethscr:0xDeaDDEaDDeAdDeAdDEAdDEaddeAddEAdDEAd0001"
      implementationNames.ethscr:0x4200000000000000000000000000000000000018:
-        "ProxyAdmin"
+        "Proxy"
    }
```

Generated with discovered.json: 0x3bdda8534b53f90e2c3ee53b461b1a4d7baebc50

# Diff at Wed, 14 Jan 2026 13:02:59 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- comparing to: main@e7f517859f6f313e4c82beba4300d1738b863a5d block: 1768211188
- current timestamp: 1768395715

## Description

Config change: Removed `proxyType: immutable` workaround for L2 predeploys (Ethscriptions, EthscriptionsProver, L2ToL1MessagePasser). These contracts are now properly detected by l2b rpc as EIP1967 proxies (DeaD owner) with their implementations tracked.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1768211188 (main branch discovery), not current.

```diff
    contract Ethscriptions (ethscr:0x3300000000000000000000000000000000000001) {
    +++ description: Core Ethscriptions NFT contract that manages ethscription ownership and metadata on L2.
      sourceHashes.1:
+        "0x0645ac658c841359389c047ca68b72e620b5caf18e80d9fdca1667bdfe888ab7"
      proxyType:
-        "immutable"
+        "EIP1967 proxy"
      values.$immutable:
-        true
      values.$admin:
+        "ethscr:0x4200000000000000000000000000000000000018"
      values.$implementation:
+        "ethscr:0xc0D3C0d3C0d3c0d3c0D3C0D3C0D3C0d3c0d30001"
      values.$pastUpgrades:
+        []
      values.$upgradeCount:
+        0
      values.name:
+        "Ethscriptions"
      values.prover:
+        "ethscr:0x3300000000000000000000000000000000000003"
      values.symbol:
+        "ETHSCRIPTIONS"
      implementationNames.ethscr:0xc0D3C0d3C0d3c0d3c0D3C0D3C0D3C0d3c0d30001:
+        "Ethscriptions"
    }
```

```diff
    contract EthscriptionsProver (ethscr:0x3300000000000000000000000000000000000003) {
    +++ description: L2 predeploy that automatically sends ethscription state snapshots to L1 via the L2ToL1MessagePasser whenever an ethscription is created or transferred.
      sourceHashes.0:
+        "0xa20aefed1e9e4886d8048e954bbc525daabd6ee73cb68eb22485144f5b7e64e0"
      proxyType:
-        "immutable"
+        "EIP1967 proxy"
      values.$immutable:
-        true
      values.$admin:
+        "ethscr:0x4200000000000000000000000000000000000018"
      values.$implementation:
+        "ethscr:0xC0D3c0d3C0d3C0D3c0D3c0D3C0D3c0d3C0d30003"
      values.$pastUpgrades:
+        []
      values.$upgradeCount:
+        0
      implementationNames.ethscr:0xC0D3c0d3C0d3C0D3c0D3c0D3C0D3c0d3C0d30003:
+        "EthscriptionsProver"
    }
```

```diff
    contract L2ToL1MessagePasser (ethscr:0x4200000000000000000000000000000000000016) {
    +++ description: L2 predeploy for passing messages from L2 to L1. Messages are automatically sent by the EthscriptionsProver when ethscriptions are created or transferred.
      sourceHashes.1:
+        "0xeae30ba6711a363cca12f4e057185a1206f3f1adb48c6917f1b8bb4bc5717e0d"
      proxyType:
-        "immutable"
+        "EIP1967 proxy"
      values.$immutable:
-        true
      values.$admin:
+        "ethscr:0x4200000000000000000000000000000000000018"
      values.$implementation:
+        "ethscr:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016"
      values.$pastUpgrades:
+        []
      values.$upgradeCount:
+        0
      values.MESSAGE_VERSION:
+        1
      implementationNames.ethscr:0xC0D3C0d3C0d3c0d3C0d3C0D3c0D3c0d3c0D30016:
+        "L2ToL1MessagePasser"
    }
```

```diff
+   Status: CREATED
    contract ProxyAdmin (ethscr:0x4200000000000000000000000000000000000018)
    +++ description: ProxyAdmin predeploy that manages proxy upgrades for L2 predeploys.
```

Generated with discovered.json: 0x98cd5c5394c315ca5006ad70a81aa81b3e313819

# Diff at Mon, 12 Jan 2026 09:47:31 GMT:

- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1768211188

## Description

Initial discovery.

## Initial discovery

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459)
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0xa236E6E31d94b613923d18313f534CE5b6b98eE1)
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract Rollup (eth:0xA9Bbcad27E1571AAFAD89F953c81c8A1440A0b8b)
    +++ description: Core rollup contract that manages the state of the rollup and its ZK fault proof system.
```

```diff
+   Status: CREATED
    contract Facet Multisig (eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethscriptions (ethscr:0x3300000000000000000000000000000000000001)
    +++ description: Core Ethscriptions NFT contract that manages ethscription ownership and metadata on L2.
```

```diff
+   Status: CREATED
    contract EthscriptionsProver (ethscr:0x3300000000000000000000000000000000000003)
    +++ description: L2 predeploy that automatically sends ethscription state snapshots to L1 via the L2ToL1MessagePasser whenever an ethscription is created or transferred.
```

```diff
+   Status: CREATED
    contract L2ToL1MessagePasser (ethscr:0x4200000000000000000000000000000000000016)
    +++ description: L2 predeploy for passing messages from L2 to L1. Messages are automatically sent by the EthscriptionsProver when ethscriptions are created or transferred.
```
