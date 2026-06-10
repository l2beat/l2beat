Generated with discovered.json: 0x141aebc993b6329ff5504214ddd85ec6e4ae9326

# Diff at Tue, 09 Jun 2026 12:43:33 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1769601454
- current timestamp: 1769601454

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769601454 (main branch discovery), not current.

```diff
    EOA  (eth:0x615452db5467849689E98a8C5C242A96cF768a94) {
    +++ description: None
      receivedPermissions.0.permission:
-        "propose"
+        "interact"
    }
```

Generated with discovered.json: 0x987747f475acdc536b5552469761388889aba515

# Diff at Fri, 08 May 2026 07:51:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1769601454
- current timestamp: 1769601454

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769601454 (main branch discovery), not current.

```diff
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) [succinct/SP1Verifier] {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      sourceHashes.0:
-        "0x3ffef9f4f4cd24743e4612a4c1011ca13c0b983c52bbe8f4a6d40a58e5eeae42"
+        "0x2844ea9f19c8d87b0e033bd0b25983f2503dcc86aceaacbf4785f0f2507f2278"
    }
```

```diff
    contract SP1VerifierGateway (eth:0xa236E6E31d94b613923d18313f534CE5b6b98eE1) [succinct/SP1VerifierGateway] {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      sourceHashes.0:
-        "0xc651adcd746b8794c5b6c418aeb146f1b13b207cc9d2712ba66a42bd4b29af37"
+        "0xf67f0dc1760fe9589909a16bfef47f76d6dfa71427e034d759a3d8da88a42645"
    }
```

```diff
    contract Rollup (eth:0xA9Bbcad27E1571AAFAD89F953c81c8A1440A0b8b) [facet/Rollup] {
    +++ description: Core rollup contract that manages the state of the rollup and its ZK fault proof system.
      sourceHashes.0:
-        "0xd5ecfadcad80a6370fcf20fd9285959bf3452352c79ba06748998ea55cad3732"
+        "0x18a889e730255386b3ecf5a44ea1cdcc2a4ecbd02908aa838976646eb02a9681"
    }
```

```diff
    contract Facet Multisig (eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract Ethscriptions (ethscr:0x3300000000000000000000000000000000000001) [N/A] {
    +++ description: Core Ethscriptions NFT contract that manages ethscription ownership and metadata on L2.
      sourceHashes.1:
-        "0x0645ac658c841359389c047ca68b72e620b5caf18e80d9fdca1667bdfe888ab7"
+        "0xa8b17b862d2dbb402cd77e2e521f3123cf85d3a56daa10322741ff651dc95853"
    }
```

```diff
    contract EthscriptionsProver (ethscr:0x3300000000000000000000000000000000000003) [N/A] {
    +++ description: L2 predeploy that automatically sends ethscription state snapshots to L1 via the L2ToL1MessagePasser whenever an ethscription is created or transferred.
      sourceHashes.1:
-        "0xa20aefed1e9e4886d8048e954bbc525daabd6ee73cb68eb22485144f5b7e64e0"
+        "0x76a32ddc625f2eb76f3d54283fb9ef50040eb2d1e8799a9af8ef75a496c9089d"
    }
```

Generated with discovered.json: 0xfeb95a23d53cc831c07d8943f13a9467c63cc93a

# Diff at Tue, 05 May 2026 10:22:10 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1769601454
- current timestamp: 1769601454

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1769601454 (main branch discovery), not current.

```diff
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) {
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
      deployerAddress:
+        "eth:0xBaB2c2aF5b91695e65955DA60d63aD1b2aE81126"
    }
```

```diff
    contract SP1VerifierGateway (eth:0xa236E6E31d94b613923d18313f534CE5b6b98eE1) {
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
      deployerAddress:
+        "eth:0x23B0caA3782b5CE6Be7A54655A5DD2791335EAFC"
    }
```

```diff
    contract Rollup (eth:0xA9Bbcad27E1571AAFAD89F953c81c8A1440A0b8b) {
    +++ description: Core rollup contract that manages the state of the rollup and its ZK fault proof system.
      deployerAddress:
+        "eth:0x6976bD97EE6dc7517c5C288251d9305A77Db2e26"
    }
```

```diff
    contract Facet Multisig (eth:0xb2B01DeCb6cd36E7396b78D3744482627F22C525) {
    +++ description: None
      deployerAddress:
+        "eth:0xC2172a6315c1D7f6855768F843c420EbB36eDa97"
    }
```

```diff
    contract Ethscriptions (ethscr:0x3300000000000000000000000000000000000001) {
    +++ description: Core Ethscriptions NFT contract that manages ethscription ownership and metadata on L2.
      deployerAddress:
+        "ethscr:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract EthscriptionsProver (ethscr:0x3300000000000000000000000000000000000003) {
    +++ description: L2 predeploy that automatically sends ethscription state snapshots to L1 via the L2ToL1MessagePasser whenever an ethscription is created or transferred.
      deployerAddress:
+        "ethscr:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract L2ToL1MessagePasser (ethscr:0x4200000000000000000000000000000000000016) {
    +++ description: L2 predeploy for passing messages from L2 to L1. Messages are automatically sent by the EthscriptionsProver when ethscriptions are created or transferred.
      deployerAddress:
+        "ethscr:0x0000000000000000000000000000000000000000"
    }
```

```diff
    contract Proxy (ethscr:0x4200000000000000000000000000000000000018) {
    +++ description: ProxyAdmin predeploy that manages proxy upgrades for L2 predeploys.
      deployerAddress:
+        "ethscr:0x0000000000000000000000000000000000000000"
    }
```

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
