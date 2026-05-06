Generated with discovered.json: 0x59fc5105f90cb022c6a91910145956debfa4f923

# Diff at Wed, 06 May 2026 10:27:58 GMT:

- author: Sergey Shemyakov (<sergey.shemyakov@l2beat.com>)
- current timestamp: 1777548282

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract cTornado (eth:0x03893a7c7463AE47D46bc7f091665f1893656003)
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x07687e702b410Fa43f4cB4Af7FA097918ffD2730)
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract WithdrawVerifier (eth:0x09193888b3f38C82dEdfda55259A82C0E7De875E)
    +++ description: Verifier contract for Tornado anonymity-mining withdrawal proofs.
```

```diff
+   Status: CREATED
    contract TornadoCash_Eth_01 (eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc)
    +++ description: Legacy fixed-denomination ETH mixer for 0.1 ETH deposits. This older pool generation keeps an operator role that can replace the withdrawal verifier and, for this instance, perform a one-time state migration.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x169AD27A470D064DEDE56a2D3ff727986b15D52B)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x178169B423a011fff22B9e3F3abeA13414dDD0F1)
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x22aaA7720ddd5388A3c0A3333430953C68f1849b)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x23773E65ed146A459791799d01336DB287f25334)
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract cTornado (eth:0x2717c5e28cf931547B621a5dddb772Ab6A35B701)
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
```

```diff
+   Status: CREATED
    contract TornadoVault (eth:0x2F50508a8a3D323B91336FA3eA6ae50E55f32185)
    +++ description: Vault that escrows locked TORN on behalf of governance users and serves withdrawals initiated by the governance contract.
```

```diff
+   Status: CREATED
    contract TornadoTreesV1 (eth:0x43a3bE4Ae954d9869836702AFd10393D3a7Ea417)
    +++ description: Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract TornadoCash_eth (eth:0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936)
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract Proposal (eth:0x4B6C07B8940a7602fE4332AFa915b366e56eAce5)
    +++ description: One-off governance proposal payload that deployed the newer Tornado Trees and proxy wiring, migrated legacy tree state, and disabled old mineable instances on the legacy proxy.
```

```diff
+   Status: CREATED
    contract TornadoTreesV2 (eth:0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce)
    +++ description: Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier.
```

```diff
+   Status: CREATED
    contract RelayerRegistry (eth:0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2)
    +++ description: Upgradeable registry that tracks registered relayers, their worker addresses, and their staked TORN balances used to service withdrawals.
```

```diff
+   Status: CREATED
    contract TornadoStakingRewards (eth:0x5B3f656C80E8ddb9ec01Dd9018815576E9238c29)
    +++ description: Upgradeable staking rewards contract that holds relayer stake, distributes burn-derived rewards to locked TORN holders, and lets governance recover TORN from the contract.
```

```diff
+   Status: CREATED
    contract RewardSwap (eth:0x5cab7692D4E94096462119ab7bF57319726Eed2A)
    +++ description: Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight.
```

```diff
+   Status: CREATED
    contract GovernanceProposalStateUpgrade (eth:0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce)
    +++ description: Upgradeable Tornado Cash governance contract that manages proposals, voting, execution, and treasury-connected governance modules. If you trust this contract, you trust its upgrade path and proposal rules to change protocol governance behavior.
```

```diff
+   Status: CREATED
    contract FeeManager (eth:0x5f6c97C6AD7bdd0AE7E0Dd4ca33A4ED3fDabD4D7)
    +++ description: Upgradeable fee manager that derives relayer burn fees for each Tornado instance from registry settings and Uniswap TWAP data.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0x610B717796ad172B316836AC95a2ffad065CeaB4)
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract DepositTree (eth:0x6234c4C2734D2B246AE074492F402D8f58ff3226)
    +++ description: Unverified merkle tree instance that stores legacy Tornado deposit leaves for TornadoTreesV1.
```

```diff
+   Status: CREATED
    contract TreeUpdateVerifier (eth:0x653477c392c16b0765603074f157314Cc4f40c32)
    +++ description: Verifier contract for Tornado mining account-tree update proofs.
```

```diff
+   Status: CREATED
    contract TornadoProxyV2 (eth:0x722122dF12D4e14e13Ac3b6895a86e84145b6967)
    +++ description: Newer immutable Tornado proxy that routes deposits and withdrawals to supported pool instances and records them in the upgraded Tornado Trees contract.
```

```diff
+   Status: CREATED
    contract Miner (eth:0x746Aebc06D2aE31B71ac51429A19D54E797878E9)
    +++ description: Mining and reward-distribution contract for Tornado anonymity mining. It verifies reward and withdrawal proofs, maintains account roots, and routes TORN rewards through the swap contract.
```

```diff
+   Status: CREATED
    contract TORN (eth:0x77777FeDdddFfC19Ff86DB637967013e6C6A116C)
    +++ description: TORN governance token contract. Transfers start paused and can later be toggled by governance, which also controls the paused-transfer allowlist and token rescue functions.
```

```diff
+   Status: CREATED
    contract MiMCHasher (eth:0x83584f83f26aF4eDDA9CBe8C730bc87C364b28fe)
    +++ description: Unverified MiMC hasher used by newer Tornado pool generations for commitment-tree operations.
```

```diff
+   Status: CREATED
    contract RewardVerifier (eth:0x88fd245fEdeC4A936e700f9173454D1931B4C307)
    +++ description: Verifier contract for Tornado anonymity-mining reward proofs.
```

```diff
+   Status: CREATED
    contract TornadoProxyV1 (eth:0x905b63Fff465B9fFBF41DeA908CEb12478ec7601)
    +++ description: Legacy immutable Tornado proxy that routes deposits and withdrawals to pool instances and records them in the legacy Tornado Trees contract.
```

```diff
+   Status: CREATED
    contract TornadoCash_eth (eth:0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF)
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract TornadoCash_eth (eth:0xA160cdAB225685dA1d56aa342Ad8841c3b53f291)
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract GnosisSafe (eth:0xb04E030140b30C27bcdfaafFFA98C57d80eDa7B4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract InstanceRegistry (eth:0xB20c66C4DE72433F3cE747b58B86830c459CA911)
    +++ description: Upgradeable registry of supported Tornado Cash pool instances and their mutable per-instance fee and routing configuration.
```

```diff
+   Status: CREATED
    contract ERC20Tornado (eth:0xbB93e510BbCD0B7beb5A853875f9eC60275CF498)
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
```

```diff
+   Status: CREATED
    contract WithdrawalTree (eth:0xbFA347D89Ac54F7C2De2433458cb98A85fc03CEd)
    +++ description: Unverified merkle tree instance that stores legacy Tornado withdrawal leaves for TornadoTreesV1.
```

```diff
+   Status: CREATED
    contract Verifier (eth:0xce172ce1F20EC0B3728c9965470eaf994A03557A)
    +++ description: Groth16 verifier contract used by Tornado Cash pool withdrawal proofs.
```

```diff
+   Status: CREATED
    contract cTornado (eth:0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af)
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract PoseidonHasher (eth:0xD82ed8786D7c69DC7e052F7A542AB047971E73d2)
    +++ description: Unverified Poseidon hasher used by the legacy Tornado Trees merkle trees.
```

```diff
+   Status: CREATED
    contract TornadoRouter (eth:0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b)
    +++ description: Router contract that validates supported instances, forwards deposits and withdrawals, and burns relayer stake through the relayer registry during withdrawals.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0xd96f2B1c14Db8458374d9Aca76E26c3D18364307)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```

```diff
+   Status: CREATED
    contract BatchTreeUpdateVerifier (eth:0xEd3B00B651c4c7AF77c2fDdce4a388de84b507C6)
    +++ description: Verifier contract for batched Tornado Trees root updates.
```

```diff
+   Status: CREATED
    contract GasCompensationVault (eth:0xFA4C1f3f7D5dd7c12a9Adb82Cd7dDA542E3d59ef)
    +++ description: Vault that escrows ETH for governance gas-compensation payouts and can return unused funds to governance.
```

```diff
+   Status: CREATED
    contract TornadoCash_erc20 (eth:0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144)
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
```
