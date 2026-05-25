Generated with discovered.json: 0x12c3dcb9cebdf53db94e788cf06f9e4edb995b01

# Diff at Fri, 22 May 2026 11:00:23 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@5632621dca713c3c25f738ebb5a0b887f7bed9c4 block: 1779099959
- current timestamp: 1779439938

## Description

Cleaned up tornado cash configs. Also, because this disco is on a different branch, spammy values reappeared.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779099959 (main branch discovery), not current.

```diff
    contract Pool_50K_cDAI (eth:0x03893a7c7463AE47D46bc7f091665f1893656003) [tornado-cash/cTornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 50K cDAI deposits.
      name:
-        "cTornado"
+        "Pool_50K_cDAI"
      description:
-        "Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address."
+        "Fixed-denomination Tornado Cash pool for 50K cDAI deposits."
    }
```

```diff
    contract Pool_10K_DAI (eth:0x07687e702b410Fa43f4cB4Af7FA097918ffD2730) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 10K DAI deposits.
      name:
-        "ERC20Tornado"
+        "Pool_10K_DAI"
      description:
-        "Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment."
+        "Fixed-denomination Tornado Cash pool for 10K DAI deposits."
    }
```

```diff
    contract Pool_1000_USDT (eth:0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 1000 USDT deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_1000_USDT"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 1000 USDT deposits."
    }
```

```diff
    contract WithdrawVerifier (eth:0x09193888b3f38C82dEdfda55259A82C0E7De875E) [tornado-cash/WithdrawVerifier] {
    +++ description: Anonymity Mining - Verifier contract for Tornado anonymity-mining withdrawal proofs.
      description:
-        "Verifier contract for Tornado anonymity-mining withdrawal proofs."
+        "Anonymity Mining - Verifier contract for Tornado anonymity-mining withdrawal proofs."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Pool_0.1_ETH (eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc) [tornado-cash/TornadoCash_Eth_01] {
    +++ description: Fixed-denomination Tornado Cash pool for 0.1 ETH deposits.
      name:
-        "TornadoCash_Eth_01"
+        "Pool_0.1_ETH"
      description:
-        "Legacy fixed-denomination ETH mixer for 0.1 ETH deposits. This older pool generation keeps an operator role that can replace the withdrawal verifier and, for this instance, perform a one-time state migration."
+        "Fixed-denomination Tornado Cash pool for 0.1 ETH deposits."
      fieldMeta.isMigrated.severity:
-        "LOW"
+        "HIGH"
      fieldMeta.isMigrated.description:
-        "Whether the one-time legacy state migration path has already been used."
+        "Whether the one-time legacy state migration path has already been used. If true, this pool behaves like the ones without this function."
    }
```

```diff
    contract Pool_100_USDT (eth:0x169AD27A470D064DEDE56a2D3ff727986b15D52B) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 100 USDT deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_100_USDT"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 100 USDT deposits."
    }
```

```diff
    contract Pool_0.1_WBTC (eth:0x178169B423a011fff22B9e3F3abeA13414dDD0F1) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 0.1 WBTC deposits.
      name:
-        "ERC20Tornado"
+        "Pool_0.1_WBTC"
      description:
-        "Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment."
+        "Fixed-denomination Tornado Cash pool for 0.1 WBTC deposits."
    }
```

```diff
    contract Pool_5K_cDAI (eth:0x22aaA7720ddd5388A3c0A3333430953C68f1849b) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 5K cDAI deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_5K_cDAI"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 5K cDAI deposits."
    }
```

```diff
    contract Pool_100K_DAI (eth:0x23773E65ed146A459791799d01336DB287f25334) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 100K DAI deposits.
      name:
-        "ERC20Tornado"
+        "Pool_100K_DAI"
      description:
-        "Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment."
+        "Fixed-denomination Tornado Cash pool for 100K DAI deposits."
    }
```

```diff
    contract Pool_500K_cDAI (eth:0x2717c5e28cf931547B621a5dddb772Ab6A35B701) [tornado-cash/cTornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 500K cDAI deposits.
      name:
-        "cTornado"
+        "Pool_500K_cDAI"
      description:
-        "Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address."
+        "Fixed-denomination Tornado Cash pool for 500K cDAI deposits."
    }
```

```diff
    contract TornadoVault (eth:0x2F50508a8a3D323B91336FA3eA6ae50E55f32185) [tornado-cash/TornadoVault] {
    +++ description: Vault that escrows locked TORN of governance participants who wish to receive voting rights.
      description:
-        "Vault that escrows locked TORN on behalf of governance users and serves withdrawals initiated by the governance contract."
+        "Vault that escrows locked TORN of governance participants who wish to receive voting rights."
    }
```

```diff
    contract TornadoTreesV1 (eth:0x43a3bE4Ae954d9869836702AFd10393D3a7Ea417) [tornado-cash/TornadoTreesV1] {
    +++ description: Anonymity Mining - Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic.
      description:
-        "Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic."
+        "Anonymity Mining - Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract Pool_1000_USDC (eth:0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 1000 USDC deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_1000_USDC"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 1000 USDC deposits."
    }
```

```diff
    contract Pool_1_ETH (eth:0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936) [tornado-cash/TornadoCash_eth] {
    +++ description: Fixed-denomination Tornado Cash pool for 1 ETH deposits.
      name:
-        "TornadoCash_eth"
+        "Pool_1_ETH"
      description:
-        "Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 1 ETH deposits."
    }
```

```diff
    contract Proposal (eth:0x4B6C07B8940a7602fE4332AFa915b366e56eAce5) [tornado-cash/Proposal] {
    +++ description: Anonymity Mining - One-off governance proposal payload that deployed the newer Tornado Trees and proxy wiring, migrated legacy tree state, and disabled old mineable instances on the legacy proxy.
      description:
-        "One-off governance proposal payload that deployed the newer Tornado Trees and proxy wiring, migrated legacy tree state, and disabled old mineable instances on the legacy proxy."
+        "Anonymity Mining - One-off governance proposal payload that deployed the newer Tornado Trees and proxy wiring, migrated legacy tree state, and disabled old mineable instances on the legacy proxy."
      category.name:
-        "Governance"
+        "Spam"
      category.priority:
-        3
+        -1
    }
```

```diff
    contract TornadoTreesV2 (eth:0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce) [tornado-cash/TornadoTreesV2] {
    +++ description: Anonymity Mining - Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier.
      description:
-        "Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier."
+        "Anonymity Mining - Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract RelayerRegistry (eth:0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2) [tornado-cash/RelayerRegistry] {
    +++ description: Upgradeable registry that tracks registered relayers, their worker addresses, and their staked TORN balances used to service withdrawals. Relayers registered here could be queried by a tornadocash frontend to facilitate discovery for users, but users are free to use any (unregistered) relayer at withdrawal time.
      description:
-        "Upgradeable registry that tracks registered relayers, their worker addresses, and their staked TORN balances used to service withdrawals."
+        "Upgradeable registry that tracks registered relayers, their worker addresses, and their staked TORN balances used to service withdrawals. Relayers registered here could be queried by a tornadocash frontend to facilitate discovery for users, but users are free to use any (unregistered) relayer at withdrawal time."
    }
```

```diff
    contract TornadoStakingRewards (eth:0x5B3f656C80E8ddb9ec01Dd9018815576E9238c29) [tornado-cash/TornadoStakingRewards] {
    +++ description: Staking contract that escrows TORN staked by relayers. With time, their stake is subtracted from for being officially registered as relayers and receiving fees from each withdrawal, and is redirected as TORN rewards for governance participants who are locking their TORN for voting/staking.
      description:
-        "Upgradeable staking rewards contract that holds relayer stake, distributes burn-derived rewards to locked TORN holders, and lets governance recover TORN from the contract."
+        "Staking contract that escrows TORN staked by relayers. With time, their stake is subtracted from for being officially registered as relayers and receiving fees from each withdrawal, and is redirected as TORN rewards for governance participants who are locking their TORN for voting/staking."
    }
```

```diff
    contract RewardSwap (eth:0x5cab7692D4E94096462119ab7bF57319726Eed2A) [tornado-cash/RewardSwap] {
    +++ description: Anonymity Mining - Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight.
      description:
-        "Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight."
+        "Anonymity Mining - Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract Pool_1_WBTC (eth:0x610B717796ad172B316836AC95a2ffad065CeaB4) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 1 WBTC deposits.
      name:
-        "ERC20Tornado"
+        "Pool_1_WBTC"
      description:
-        "Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment."
+        "Fixed-denomination Tornado Cash pool for 1 WBTC deposits."
    }
```

```diff
    contract TreeUpdateVerifier (eth:0x653477c392c16b0765603074f157314Cc4f40c32) [tornado-cash/TreeUpdateVerifier] {
    +++ description: Anonymity Mining - Verifier contract for Tornado mining account-tree update proofs.
      description:
-        "Verifier contract for Tornado mining account-tree update proofs."
+        "Anonymity Mining - Verifier contract for Tornado mining account-tree update proofs."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract TornadoProxyV2 (eth:0x722122dF12D4e14e13Ac3b6895a86e84145b6967) [tornado-cash/TornadoProxyV2] {
    +++ description: Anonymity Mining - Newer immutable Tornado proxy that routes deposits and withdrawals to supported pool instances and records them in the upgraded Tornado Trees contract.
      description:
-        "Newer immutable Tornado proxy that routes deposits and withdrawals to supported pool instances and records them in the upgraded Tornado Trees contract."
+        "Anonymity Mining - Newer immutable Tornado proxy that routes deposits and withdrawals to supported pool instances and records them in the upgraded Tornado Trees contract."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract Miner (eth:0x746Aebc06D2aE31B71ac51429A19D54E797878E9) [tornado-cash/Miner] {
    +++ description: Anonymity Mining - Mining and reward-distribution contract for Tornado anonymity mining. It verifies reward and withdrawal proofs, maintains account roots, and routes TORN rewards through the swap contract.
      description:
-        "Mining and reward-distribution contract for Tornado anonymity mining. It verifies reward and withdrawal proofs, maintains account roots, and routes TORN rewards through the swap contract."
+        "Anonymity Mining - Mining and reward-distribution contract for Tornado anonymity mining. It verifies reward and withdrawal proofs, maintains account roots, and routes TORN rewards through the swap contract."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract MiMCHasher (eth:0x83584f83f26aF4eDDA9CBe8C730bc87C364b28fe) [N/A] {
    +++ description: Unverified MiMC hasher used by newer Tornado pool generations for commitment-tree operations. If this contract were malicious or had a backdoor, all pools using it would be compromised.
      description:
-        "Unverified MiMC hasher used by newer Tornado pool generations for commitment-tree operations."
+        "Unverified MiMC hasher used by newer Tornado pool generations for commitment-tree operations. If this contract were malicious or had a backdoor, all pools using it would be compromised."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract RewardVerifier (eth:0x88fd245fEdeC4A936e700f9173454D1931B4C307) [tornado-cash/RewardVerifier] {
    +++ description: Anonymity Mining - Verifier contract for Tornado anonymity-mining reward proofs.
      description:
-        "Verifier contract for Tornado anonymity-mining reward proofs."
+        "Anonymity Mining - Verifier contract for Tornado anonymity-mining reward proofs."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract TornadoProxyV1 (eth:0x905b63Fff465B9fFBF41DeA908CEb12478ec7601) [tornado-cash/TornadoProxyV1] {
    +++ description: Anonymity Mining - Legacy immutable Tornado proxy that routes deposits and withdrawals to pool instances and records them in the legacy Tornado Trees contract.
      description:
-        "Legacy immutable Tornado proxy that routes deposits and withdrawals to pool instances and records them in the legacy Tornado Trees contract."
+        "Anonymity Mining - Legacy immutable Tornado proxy that routes deposits and withdrawals to pool instances and records them in the legacy Tornado Trees contract."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract Pool_10_ETH (eth:0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF) [tornado-cash/TornadoCash_eth] {
    +++ description: Fixed-denomination Tornado Cash pool for 10 ETH deposits.
      name:
-        "TornadoCash_eth"
+        "Pool_10_ETH"
      description:
-        "Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 10 ETH deposits."
    }
```

```diff
    contract Pool_100_ETH (eth:0xA160cdAB225685dA1d56aa342Ad8841c3b53f291) [tornado-cash/TornadoCash_eth] {
    +++ description: Fixed-denomination Tornado Cash pool for 100 ETH deposits.
      name:
-        "TornadoCash_eth"
+        "Pool_100_ETH"
      description:
-        "Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 100 ETH deposits."
    }
```

```diff
    contract Pool_10_WBTC (eth:0xbB93e510BbCD0B7beb5A853875f9eC60275CF498) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 10 WBTC deposits.
      name:
-        "ERC20Tornado"
+        "Pool_10_WBTC"
      description:
-        "Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment."
+        "Fixed-denomination Tornado Cash pool for 10 WBTC deposits."
    }
```

```diff
    contract Pool_5M_cDAI (eth:0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af) [tornado-cash/cTornado] {
    +++ description: Fixed-denomination Tornado Cash pool for 5M cDAI deposits.
      name:
-        "cTornado"
+        "Pool_5M_cDAI"
      description:
-        "Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address."
+        "Fixed-denomination Tornado Cash pool for 5M cDAI deposits."
    }
```

```diff
    contract Pool_100_DAI (eth:0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 100 DAI deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_100_DAI"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 100 DAI deposits."
    }
```

```diff
    contract PoseidonHasher (eth:0xD82ed8786D7c69DC7e052F7A542AB047971E73d2) [N/A] {
    +++ description: Anonymity Mining - Unverified Poseidon hasher used by the legacy Tornado Trees merkle trees.
      description:
-        "Unverified Poseidon hasher used by the legacy Tornado Trees merkle trees."
+        "Anonymity Mining - Unverified Poseidon hasher used by the legacy Tornado Trees merkle trees."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract TornadoRouter (eth:0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b) [tornado-cash/TornadoRouter] {
    +++ description: Router contract that validates supported instances, forwards deposits and withdrawals, and subtracts from relayer stake through the relayer registry during withdrawals.
      description:
-        "Router contract that validates supported instances, forwards deposits and withdrawals, and burns relayer stake through the relayer registry during withdrawals."
+        "Router contract that validates supported instances, forwards deposits and withdrawals, and subtracts from relayer stake through the relayer registry during withdrawals."
    }
```

```diff
    contract Pool_100_USDC (eth:0xd96f2B1c14Db8458374d9Aca76E26c3D18364307) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 100 USDC deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_100_USDC"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 100 USDC deposits."
    }
```

```diff
    contract BatchTreeUpdateVerifier (eth:0xEd3B00B651c4c7AF77c2fDdce4a388de84b507C6) [tornado-cash/BatchTreeUpdateVerifier] {
    +++ description: Anonymity Mining - Verifier contract for batched Tornado Trees root updates.
      description:
-        "Verifier contract for batched Tornado Trees root updates."
+        "Anonymity Mining - Verifier contract for batched Tornado Trees root updates."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Pool_1000_DAI (eth:0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144) [tornado-cash/TornadoCash_erc20_v1] {
    +++ description: Fixed-denomination Tornado Cash pool for 1000 DAI deposits.
      name:
-        "TornadoCash_erc20"
+        "Pool_1000_DAI"
      template:
-        "tornado-cash/TornadoCash_erc20"
+        "tornado-cash/TornadoCash_erc20_v1"
      description:
-        "Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced."
+        "Fixed-denomination Tornado Cash pool for 1000 DAI deposits."
    }
```

Generated with discovered.json: 0xde4e5709bcc2016ada2dd90c69d6097a97a45e23

# Diff at Mon, 18 May 2026 10:37:33 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- comparing to: main@81908b566e918425ebf298c08aed66029316c1ad block: 1777548282
- current timestamp: 1779099959

## Description

Clean up spammy values.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777548282 (main branch discovery), not current.

```diff
    contract TornadoTreesV1 (eth:0x43a3bE4Ae954d9869836702AFd10393D3a7Ea417) [tornado-cash/TornadoTreesV1] {
    +++ description: Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic.
      values.blockNumber:
-        24992607
      values.lastProcessedDepositLeaf:
-        6144
      values.lastProcessedWithdrawalLeaf:
-        5632
    }
```

```diff
    contract TornadoTreesV2 (eth:0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce) [tornado-cash/TornadoTreesV2] {
    +++ description: Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier.
      values.blockNumber:
-        24992607
      values.depositsLength:
-        92895
      values.depositsV1Length:
-        22008
      values.lastProcessedDepositLeaf:
-        70656
      values.lastProcessedWithdrawalLeaf:
-        74752
      values.withdrawalsLength:
-        85961
      values.withdrawalsV1Length:
-        14884
    }
```

```diff
    contract RewardSwap (eth:0x5cab7692D4E94096462119ab7bF57319726Eed2A) [tornado-cash/RewardSwap] {
    +++ description: Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight.
      values.getTimestamp:
-        1777548275
    }
```

```diff
    contract TORN (eth:0x77777FeDdddFfC19Ff86DB637967013e6C6A116C) [tornado-cash/TORN] {
    +++ description: TORN governance token contract. Transfers start paused and can later be toggled by governance, which also controls the paused-transfer allowlist and token rescue functions.
      values.blockTimestamp:
-        1777548275
      fieldMeta.canUnpauseAfter.severity:
-        "LOW"
+        "HIGH"
    }
```

Generated with discovered.json: 0xa08143f070688c421cd9c5b5ca3cdc0716cd9c3b

# Diff at Tue, 12 May 2026 10:06:35 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1777548282

## Description

Config: use the new flattener implementation. Also cleaned up spammy disco

## Initial discovery

```diff
+   Status: CREATED
    contract cTornado (eth:0x03893a7c7463AE47D46bc7f091665f1893656003) [tornado-cash/cTornado]
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x07687e702b410Fa43f4cB4Af7FA097918ffD2730) [tornado-cash/ERC20Tornado]
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract WithdrawVerifier (eth:0x09193888b3f38C82dEdfda55259A82C0E7De875E) [tornado-cash/WithdrawVerifier]
    +++ description: Verifier contract for Tornado anonymity-mining withdrawal proofs.
```

```diff
+   Status: CREATED
    contract TornadoCash_Eth_01 (eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc) [tornado-cash/TornadoCash_Eth_01]
    +++ description: Legacy fixed-denomination ETH mixer for 0.1 ETH deposits. This older pool generation keeps an operator role that can replace the withdrawal verifier and, for this instance, perform a one-time state migration.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x169AD27A470D064DEDE56a2D3ff727986b15D52B) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x178169B423a011fff22B9e3F3abeA13414dDD0F1) [tornado-cash/ERC20Tornado]
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x22aaA7720ddd5388A3c0A3333430953C68f1849b) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x23773E65ed146A459791799d01336DB287f25334) [tornado-cash/ERC20Tornado]
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract cTornado (eth:0x2717c5e28cf931547B621a5dddb772Ab6A35B701) [tornado-cash/cTornado]
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
```

```diff
+   Status: CREATED
    contract TornadoVault (eth:0x2F50508a8a3D323B91336FA3eA6ae50E55f32185) [tornado-cash/TornadoVault]
    +++ description: Vault that escrows locked TORN on behalf of governance users and serves withdrawals initiated by the governance contract.
```

```diff
+   Status: CREATED
    contract TornadoTreesV1 (eth:0x43a3bE4Ae954d9869836702AFd10393D3a7Ea417) [tornado-cash/TornadoTreesV1]
    +++ description: Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract TornadoCash_eth (eth:0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936) [tornado-cash/TornadoCash_eth]
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract Proposal (eth:0x4B6C07B8940a7602fE4332AFa915b366e56eAce5) [tornado-cash/Proposal]
    +++ description: One-off governance proposal payload that deployed the newer Tornado Trees and proxy wiring, migrated legacy tree state, and disabled old mineable instances on the legacy proxy.
```

```diff
+   Status: CREATED
    contract TornadoTreesV2 (eth:0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce) [tornado-cash/TornadoTreesV2]
    +++ description: Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier.
```

```diff
+   Status: CREATED
    contract RelayerRegistry (eth:0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2) [tornado-cash/RelayerRegistry]
    +++ description: Upgradeable registry that tracks registered relayers, their worker addresses, and their staked TORN balances used to service withdrawals.
```

```diff
+   Status: CREATED
    contract TornadoStakingRewards (eth:0x5B3f656C80E8ddb9ec01Dd9018815576E9238c29) [tornado-cash/TornadoStakingRewards]
    +++ description: Upgradeable staking rewards contract that holds relayer stake, distributes burn-derived rewards to locked TORN holders, and lets governance recover TORN from the contract.
```

```diff
+   Status: CREATED
    contract RewardSwap (eth:0x5cab7692D4E94096462119ab7bF57319726Eed2A) [tornado-cash/RewardSwap]
    +++ description: Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight.
```

```diff
+   Status: CREATED
    contract GovernanceProposalStateUpgrade (eth:0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce) [tornado-cash/GovernanceProposalStateUpgrade]
    +++ description: Upgradeable Tornado Cash governance contract that manages proposals, voting, execution, and treasury-connected governance modules. If you trust this contract, you trust its upgrade path and proposal rules to change protocol governance behavior.
```

```diff
+   Status: CREATED
    contract FeeManager (eth:0x5f6c97C6AD7bdd0AE7E0Dd4ca33A4ED3fDabD4D7) [tornado-cash/FeeManager]
    +++ description: Upgradeable fee manager that derives relayer burn fees for each Tornado instance from registry settings and Uniswap TWAP data.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x610B717796ad172B316836AC95a2ffad065CeaB4) [tornado-cash/ERC20Tornado]
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract DepositTree (eth:0x6234c4C2734D2B246AE074492F402D8f58ff3226) [N/A]
    +++ description: Unverified merkle tree instance that stores legacy Tornado deposit leaves for TornadoTreesV1.
```

```diff
+   Status: CREATED
    contract TreeUpdateVerifier (eth:0x653477c392c16b0765603074f157314Cc4f40c32) [tornado-cash/TreeUpdateVerifier]
    +++ description: Verifier contract for Tornado mining account-tree update proofs.
```

```diff
+   Status: CREATED
    contract TornadoProxyV2 (eth:0x722122dF12D4e14e13Ac3b6895a86e84145b6967) [tornado-cash/TornadoProxyV2]
    +++ description: Newer immutable Tornado proxy that routes deposits and withdrawals to supported pool instances and records them in the upgraded Tornado Trees contract.
```

```diff
+   Status: CREATED
    contract Miner (eth:0x746Aebc06D2aE31B71ac51429A19D54E797878E9) [tornado-cash/Miner]
    +++ description: Mining and reward-distribution contract for Tornado anonymity mining. It verifies reward and withdrawal proofs, maintains account roots, and routes TORN rewards through the swap contract.
```

```diff
+   Status: CREATED
    contract TORN (eth:0x77777FeDdddFfC19Ff86DB637967013e6C6A116C) [tornado-cash/TORN]
    +++ description: TORN governance token contract. Transfers start paused and can later be toggled by governance, which also controls the paused-transfer allowlist and token rescue functions.
```

```diff
+   Status: CREATED
    contract MiMCHasher (eth:0x83584f83f26aF4eDDA9CBe8C730bc87C364b28fe) [N/A]
    +++ description: Unverified MiMC hasher used by newer Tornado pool generations for commitment-tree operations.
```

```diff
+   Status: CREATED
    contract RewardVerifier (eth:0x88fd245fEdeC4A936e700f9173454D1931B4C307) [tornado-cash/RewardVerifier]
    +++ description: Verifier contract for Tornado anonymity-mining reward proofs.
```

```diff
+   Status: CREATED
    contract TornadoProxyV1 (eth:0x905b63Fff465B9fFBF41DeA908CEb12478ec7601) [tornado-cash/TornadoProxyV1]
    +++ description: Legacy immutable Tornado proxy that routes deposits and withdrawals to pool instances and records them in the legacy Tornado Trees contract.
```

```diff
+   Status: CREATED
    contract TornadoCash_eth (eth:0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF) [tornado-cash/TornadoCash_eth]
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract TornadoCash_eth (eth:0xA160cdAB225685dA1d56aa342Ad8841c3b53f291) [tornado-cash/TornadoCash_eth]
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xb04E030140b30C27bcdfaafFFA98C57d80eDa7B4) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract InstanceRegistry (eth:0xB20c66C4DE72433F3cE747b58B86830c459CA911) [tornado-cash/InstanceRegistry]
    +++ description: Upgradeable registry of supported Tornado Cash pool instances and their mutable per-instance fee and routing configuration.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0xbB93e510BbCD0B7beb5A853875f9eC60275CF498) [tornado-cash/ERC20Tornado]
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract WithdrawalTree (eth:0xbFA347D89Ac54F7C2De2433458cb98A85fc03CEd) [N/A]
    +++ description: Unverified merkle tree instance that stores legacy Tornado withdrawal leaves for TornadoTreesV1.
```

```diff
+   Status: CREATED
    contract Verifier (eth:0xce172ce1F20EC0B3728c9965470eaf994A03557A) [tornado-cash/Verifier]
    +++ description: Groth16 verifier contract used by Tornado Cash pool withdrawal proofs.
```

```diff
+   Status: CREATED
    contract cTornado (eth:0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af) [tornado-cash/cTornado]
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract PoseidonHasher (eth:0xD82ed8786D7c69DC7e052F7A542AB047971E73d2) [N/A]
    +++ description: Unverified Poseidon hasher used by the legacy Tornado Trees merkle trees.
```

```diff
+   Status: CREATED
    contract TornadoRouter (eth:0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b) [tornado-cash/TornadoRouter]
    +++ description: Router contract that validates supported instances, forwards deposits and withdrawals, and burns relayer stake through the relayer registry during withdrawals.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0xd96f2B1c14Db8458374d9Aca76E26c3D18364307) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract BatchTreeUpdateVerifier (eth:0xEd3B00B651c4c7AF77c2fDdce4a388de84b507C6) [tornado-cash/BatchTreeUpdateVerifier]
    +++ description: Verifier contract for batched Tornado Trees root updates.
```

```diff
+   Status: CREATED
    contract GasCompensationVault (eth:0xFA4C1f3f7D5dd7c12a9Adb82Cd7dDA542E3d59ef) [tornado-cash/GasCompensationVault]
    +++ description: Vault that escrows ETH for governance gas-compensation payouts and can return unused funds to governance.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144) [tornado-cash/TornadoCash_erc20]
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```
