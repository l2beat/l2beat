Generated with discovered.json: 0xf81df1132a06c2c7b6387ce5d38e3f94024a91f8

# Diff at Fri, 08 May 2026 07:52:37 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777548282
- current timestamp: 1777548282

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777548282 (main branch discovery), not current.

```diff
    contract cTornado (eth:0x03893a7c7463AE47D46bc7f091665f1893656003) [tornado-cash/cTornado] {
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
      deployerAddress:
+        "eth:0x2Ab13b86b8c56F97995B0b7b54dDC7Fc30403A0B"
    }
```

```diff
    contract ERC20Tornado (eth:0x07687e702b410Fa43f4cB4Af7FA097918ffD2730) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
      sourceHashes.0:
-        "0xaa0353330a0e3eb0194f6d9dbc3128739baeaa1e337a6a170a46fe03f087c45f"
+        "0x12c6ad9449010bcc6706bf48e4e7ff827c6af9cd2a4ecf2723d9c7ebd79271da"
      deployerAddress:
+        "eth:0x645D7F28eC6E41B6f6f6A42b49fAe503762B9551"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0x0836222F2B2B24A3F36f98668Ed8F0B38D1a872f) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract WithdrawVerifier (eth:0x09193888b3f38C82dEdfda55259A82C0E7De875E) [tornado-cash/WithdrawVerifier] {
    +++ description: Verifier contract for Tornado anonymity-mining withdrawal proofs.
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TornadoCash_Eth_01 (eth:0x12D66f87A04A9E220743712cE6d9bB1B5616B8Fc) [tornado-cash/TornadoCash_Eth_01] {
    +++ description: Legacy fixed-denomination ETH mixer for 0.1 ETH deposits. This older pool generation keeps an operator role that can replace the withdrawal verifier and, for this instance, perform a one-time state migration.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0x169AD27A470D064DEDE56a2D3ff727986b15D52B) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract ERC20Tornado (eth:0x178169B423a011fff22B9e3F3abeA13414dDD0F1) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
      sourceHashes.0:
-        "0xaa0353330a0e3eb0194f6d9dbc3128739baeaa1e337a6a170a46fe03f087c45f"
+        "0x12c6ad9449010bcc6706bf48e4e7ff827c6af9cd2a4ecf2723d9c7ebd79271da"
      deployerAddress:
+        "eth:0x6D03A79fe92e6F0378025BBFe81Cfc27caF67F6c"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0x22aaA7720ddd5388A3c0A3333430953C68f1849b) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract ERC20Tornado (eth:0x23773E65ed146A459791799d01336DB287f25334) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
      sourceHashes.0:
-        "0xaa0353330a0e3eb0194f6d9dbc3128739baeaa1e337a6a170a46fe03f087c45f"
+        "0x12c6ad9449010bcc6706bf48e4e7ff827c6af9cd2a4ecf2723d9c7ebd79271da"
      deployerAddress:
+        "eth:0xA66510177b4aF4e00F2908dfe1317166Deca1853"
    }
```

```diff
    contract cTornado (eth:0x2717c5e28cf931547B621a5dddb772Ab6A35B701) [tornado-cash/cTornado] {
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
      deployerAddress:
+        "eth:0x6D03A79fe92e6F0378025BBFe81Cfc27caF67F6c"
    }
```

```diff
    contract TornadoVault (eth:0x2F50508a8a3D323B91336FA3eA6ae50E55f32185) [tornado-cash/TornadoVault] {
    +++ description: Vault that escrows locked TORN on behalf of governance users and serves withdrawals initiated by the governance contract.
      deployerAddress:
+        "eth:0x9923bb2390Ab5bf92CD440c1f61e45aF44a68d1b"
    }
```

```diff
    contract TornadoTreesV1 (eth:0x43a3bE4Ae954d9869836702AFd10393D3a7Ea417) [tornado-cash/TornadoTreesV1] {
    +++ description: Legacy Tornado Trees contract that records deposit and withdrawal leaves from TornadoProxyV1 and maintains the roots later consumed by migration and mining logic.
      sourceHashes.0:
-        "0x42220759415b10107d9eb87065ecb2d3e50116518a130ea853b6edcb6fad873a"
+        "0xa851eda83278615e06c3388fec789807ce7ae088627181e0cb8c9bd92bf5ea68"
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0x4736dCf1b7A3d580672CcE6E7c65cd5cc9cFBa9D) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract TornadoCash_eth (eth:0x47CE0C6eD5B0Ce3d3A51fdb1C52DC66a7c3c2936) [tornado-cash/TornadoCash_eth] {
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract Proposal (eth:0x4B6C07B8940a7602fE4332AFa915b366e56eAce5) [tornado-cash/Proposal] {
    +++ description: One-off governance proposal payload that deployed the newer Tornado Trees and proxy wiring, migrated legacy tree state, and disabled old mineable instances on the legacy proxy.
      sourceHashes.0:
-        "0x5efc2fdc403e69629e56eddb4e3c7fe537d5a4db7adc21e95ec603f5b09005b7"
+        "0xdc8f034743e60e596fcdb7e3e2c904582718c8a12e0470e689e7b0a2344890c9"
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract TornadoTreesV2 (eth:0x527653eA119F3E6a1F5BD18fbF4714081D7B31ce) [tornado-cash/TornadoTreesV2] {
    +++ description: Upgradeable batch-based Tornado Trees contract that reuses legacy tree state, queues new leaves from the newer proxy, and accepts batched root updates proven by a verifier.
      deployerAddress:
+        "eth:0x21C30d17D9e61Ce139DFd2A3d167C5752246b938"
    }
```

```diff
    contract RelayerRegistry (eth:0x58E8dCC13BE9780fC42E8723D8EaD4CF46943dF2) [tornado-cash/RelayerRegistry] {
    +++ description: Upgradeable registry that tracks registered relayers, their worker addresses, and their staked TORN balances used to service withdrawals.
      sourceHashes.1:
-        "0x6562c649af5a2273de78fb89cf1db4efd43ef552fed9aad5375141aaf14ecad7"
+        "0x3b83e58df28ddb8b3c8ec82a36cdb845f53b946878e15d2772fc52ac728f6796"
      deployerAddress:
+        "eth:0x48dd5eAFCaeB05854D4cDFE365719Aac83E4754F"
    }
```

```diff
    contract TornadoStakingRewards (eth:0x5B3f656C80E8ddb9ec01Dd9018815576E9238c29) [tornado-cash/TornadoStakingRewards] {
    +++ description: Upgradeable staking rewards contract that holds relayer stake, distributes burn-derived rewards to locked TORN holders, and lets governance recover TORN from the contract.
      sourceHashes.0:
-        "0xebe61e1676e61adba9269518346d6b05b10832f7049857eff24049fb6bb25532"
+        "0x76b81bc5580c88e23e9d3d1236d6ff8553b1c5869b3557468a685d73d23d68d4"
      sourceHashes.1:
-        "0x9b6cd2c78dfce2a3d533aad6cac2e2b5d7d59aa3270b9387f3ae9899928a93dd"
+        "0xeb3520419e6cf8d6df8e6f4374eb73fe72bd07e2300b7d5968153f7721f641e8"
      deployerAddress:
+        "eth:0x9Ff3C1Bea9ffB56a78824FE29f457F066257DD58"
    }
```

```diff
    contract RewardSwap (eth:0x5cab7692D4E94096462119ab7bF57319726Eed2A) [tornado-cash/RewardSwap] {
    +++ description: Liquidity schedule that pays out TORN rewards for anonymity mining. Only the Miner contract can draw from it or adjust the reward weight.
      sourceHashes.0:
-        "0xc1a6fac09032d5aeed3632059fdd847eb173330d4fe59d918861e92abdde5d7b"
+        "0x6cf43bdf6d325f58e50aa37428a9912539a19a6f759cae8f9f62654a06fb7758"
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract GovernanceProposalStateUpgrade (eth:0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce) [tornado-cash/GovernanceProposalStateUpgrade] {
    +++ description: Upgradeable Tornado Cash governance contract that manages proposals, voting, execution, and treasury-connected governance modules. If you trust this contract, you trust its upgrade path and proposal rules to change protocol governance behavior.
      sourceHashes.0:
-        "0xf18f653a74fb37c471717028f7b031b711f597b4130f3df5986227f293e8347d"
+        "0x6eb2fe7af187494527d90de82da8d5fc5f36917204155801b0f6734ef63823cb"
      sourceHashes.1:
-        "0xd9a77114dca5959dff1096daecb3b510516c82296eb2f3027020b80e7d1c7288"
+        "0xbd18ba6b0b295473e460c55cee9046ee1bdca5d9c135224970efdb4c3ab5f8e8"
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract FeeManager (eth:0x5f6c97C6AD7bdd0AE7E0Dd4ca33A4ED3fDabD4D7) [tornado-cash/FeeManager] {
    +++ description: Upgradeable fee manager that derives relayer burn fees for each Tornado instance from registry settings and Uniswap TWAP data.
      sourceHashes.1:
-        "0xf5417b21065ec5ccad77d86651acef2504dbbcc74f837c09b103221deec265d3"
+        "0xb966b4be6179012fdeee8c3f6969e28316fba385f6cbc7b19d661d547c2311b4"
      deployerAddress:
+        "eth:0x48dd5eAFCaeB05854D4cDFE365719Aac83E4754F"
    }
```

```diff
    contract ERC20Tornado (eth:0x610B717796ad172B316836AC95a2ffad065CeaB4) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
      sourceHashes.0:
-        "0xaa0353330a0e3eb0194f6d9dbc3128739baeaa1e337a6a170a46fe03f087c45f"
+        "0x12c6ad9449010bcc6706bf48e4e7ff827c6af9cd2a4ecf2723d9c7ebd79271da"
      deployerAddress:
+        "eth:0x463a35BF59618E6e7EE0696E6c274896a3e6a3Ff"
    }
```

```diff
    contract DepositTree (eth:0x6234c4C2734D2B246AE074492F402D8f58ff3226) [N/A] {
    +++ description: Unverified merkle tree instance that stores legacy Tornado deposit leaves for TornadoTreesV1.
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TreeUpdateVerifier (eth:0x653477c392c16b0765603074f157314Cc4f40c32) [tornado-cash/TreeUpdateVerifier] {
    +++ description: Verifier contract for Tornado mining account-tree update proofs.
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TornadoProxyV2 (eth:0x722122dF12D4e14e13Ac3b6895a86e84145b6967) [tornado-cash/TornadoProxyV2] {
    +++ description: Newer immutable Tornado proxy that routes deposits and withdrawals to supported pool instances and records them in the upgraded Tornado Trees contract.
      sourceHashes.0:
-        "0x3210d1bc909600212d664918623bdd92f02d2924640909ac9fc1c617ce49c413"
+        "0x94c0d6f1b0684e653aa34db54a42ff01a22e669c6f0cdf51b8ad4adf2890eac1"
      deployerAddress:
+        "eth:0x21C30d17D9e61Ce139DFd2A3d167C5752246b938"
    }
```

```diff
    contract Miner (eth:0x746Aebc06D2aE31B71ac51429A19D54E797878E9) [tornado-cash/Miner] {
    +++ description: Mining and reward-distribution contract for Tornado anonymity mining. It verifies reward and withdrawal proofs, maintains account roots, and routes TORN rewards through the swap contract.
      sourceHashes.0:
-        "0xbecce5b48aa1e467ab3739a26b7a07d25808ebece8ab63ce061a35737d316aed"
+        "0xa087c1bc5ea33b7ecefcd706e2a2fe0d817bbd7cca015119dbeb0f5f5bc799a4"
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TORN (eth:0x77777FeDdddFfC19Ff86DB637967013e6C6A116C) [tornado-cash/TORN] {
    +++ description: TORN governance token contract. Transfers start paused and can later be toggled by governance, which also controls the paused-transfer allowlist and token rescue functions.
      sourceHashes.0:
-        "0xf72c651e17b24cab6fda74ad99a602eae5485089b7f951d7c76fac5d97791cfc"
+        "0x0c4d2305ea3a745091b143e495823cead81d4cb3c02f40ad942a3919fd5e41f3"
      deployerAddress:
+        "eth:0x37341cbb14c5F128A70B149726ad8B2CE6F4C793"
    }
```

```diff
    contract MiMCHasher (eth:0x83584f83f26aF4eDDA9CBe8C730bc87C364b28fe) [N/A] {
    +++ description: Unverified MiMC hasher used by newer Tornado pool generations for commitment-tree operations.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract RewardVerifier (eth:0x88fd245fEdeC4A936e700f9173454D1931B4C307) [tornado-cash/RewardVerifier] {
    +++ description: Verifier contract for Tornado anonymity-mining reward proofs.
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TornadoProxyV1 (eth:0x905b63Fff465B9fFBF41DeA908CEb12478ec7601) [tornado-cash/TornadoProxyV1] {
    +++ description: Legacy immutable Tornado proxy that routes deposits and withdrawals to pool instances and records them in the legacy Tornado Trees contract.
      sourceHashes.0:
-        "0xc57aced8e4906b1ef94363cd1b023549eb57f9cee352d2d56ad53ef9e9675f34"
+        "0x302bb18483135d35894b2721a9b27704994889737e7f251923a1e255d5851e47"
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TornadoCash_eth (eth:0x910Cbd523D972eb0a6f4cAe4618aD62622b39DbF) [tornado-cash/TornadoCash_eth] {
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract TornadoCash_eth (eth:0xA160cdAB225685dA1d56aa342Ad8841c3b53f291) [tornado-cash/TornadoCash_eth] {
    +++ description: Legacy fixed-denomination ETH mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract GnosisSafe (eth:0xb04E030140b30C27bcdfaafFFA98C57d80eDa7B4) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0x263aadde480629cd3ca5704cc7d4e7df809d437e68f8d9864039801ddf820367"
+        "0xf42960f0c75309d8d7eeb913a74aa31fbb2e07cfa48c7ebad54152a7194d2425"
      deployerAddress:
+        "eth:0xd26BaA5F41CC7839CEdb020b6d98E1C6e1642D75"
    }
```

```diff
    contract InstanceRegistry (eth:0xB20c66C4DE72433F3cE747b58B86830c459CA911) [tornado-cash/InstanceRegistry] {
    +++ description: Upgradeable registry of supported Tornado Cash pool instances and their mutable per-instance fee and routing configuration.
      sourceHashes.1:
-        "0xb0e10cf60c4dc0d19dab4e6f321fbe4d1190725b0aa271c09e592a3d346182ef"
+        "0x3ab14a19399ef461b6c704df27fd1bca497d55f0927be48ec8d30e65ee54f24d"
      deployerAddress:
+        "eth:0x48dd5eAFCaeB05854D4cDFE365719Aac83E4754F"
    }
```

```diff
    contract ERC20Tornado (eth:0xbB93e510BbCD0B7beb5A853875f9eC60275CF498) [tornado-cash/ERC20Tornado] {
    +++ description: Fixed-denomination ERC20 mixer pool from the newer Tornado Cash pool generation. Funds are governed by the withdrawal verifier and the immutable verifier/hasher pair configured at deployment.
      sourceHashes.0:
-        "0xaa0353330a0e3eb0194f6d9dbc3128739baeaa1e337a6a170a46fe03f087c45f"
+        "0x12c6ad9449010bcc6706bf48e4e7ff827c6af9cd2a4ecf2723d9c7ebd79271da"
      deployerAddress:
+        "eth:0x6D03A79fe92e6F0378025BBFe81Cfc27caF67F6c"
    }
```

```diff
    contract WithdrawalTree (eth:0xbFA347D89Ac54F7C2De2433458cb98A85fc03CEd) [N/A] {
    +++ description: Unverified merkle tree instance that stores legacy Tornado withdrawal leaves for TornadoTreesV1.
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract Verifier (eth:0xce172ce1F20EC0B3728c9965470eaf994A03557A) [tornado-cash/Verifier] {
    +++ description: Groth16 verifier contract used by Tornado Cash pool withdrawal proofs.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract cTornado (eth:0xD21be7248e0197Ee08E0c20D4a96DEBdaC3D20Af) [tornado-cash/cTornado] {
    +++ description: Fixed-denomination cToken-based mixer pool. Anyone can sweep accrued COMP rewards, but the claimed COMP is always sent to the governance address.
      deployerAddress:
+        "eth:0xA66510177b4aF4e00F2908dfe1317166Deca1853"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0xD4B88Df4D29F5CedD6857912842cff3b20C8Cfa3) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract PoseidonHasher (eth:0xD82ed8786D7c69DC7e052F7A542AB047971E73d2) [N/A] {
    +++ description: Unverified Poseidon hasher used by the legacy Tornado Trees merkle trees.
      deployerAddress:
+        "eth:0x4e7B3769921C8DFBdb3d1B4c73558db079A180c7"
    }
```

```diff
    contract TornadoRouter (eth:0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b) [tornado-cash/TornadoRouter] {
    +++ description: Router contract that validates supported instances, forwards deposits and withdrawals, and burns relayer stake through the relayer registry during withdrawals.
      sourceHashes.0:
-        "0x17576526372cb0b3991312aa71e15c7cd4470fc5056a435d655da8f5c67258e1"
+        "0xa2b7bf6932c052821b9c3de74b314b12e6e78893edfeb967c72493a31e46f3f2"
      deployerAddress:
+        "eth:0x48dd5eAFCaeB05854D4cDFE365719Aac83E4754F"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0xd96f2B1c14Db8458374d9Aca76E26c3D18364307) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract BatchTreeUpdateVerifier (eth:0xEd3B00B651c4c7AF77c2fDdce4a388de84b507C6) [tornado-cash/BatchTreeUpdateVerifier] {
    +++ description: Verifier contract for batched Tornado Trees root updates.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

```diff
    contract GasCompensationVault (eth:0xFA4C1f3f7D5dd7c12a9Adb82Cd7dDA542E3d59ef) [tornado-cash/GasCompensationVault] {
    +++ description: Vault that escrows ETH for governance gas-compensation payouts and can return unused funds to governance.
      deployerAddress:
+        "eth:0x7073FEd8D0374D475B4581f4fE0225946Ad6cf3d"
    }
```

```diff
    contract TornadoCash_erc20 (eth:0xFD8610d20aA15b7B2E3Be39B396a1bC3516c7144) [tornado-cash/TornadoCash_erc20] {
    +++ description: Legacy fixed-denomination ERC20 mixer from the original Tornado Cash pool generation. It retains an operator role that can replace the withdrawal verifier until renounced.
      deployerAddress:
+        "eth:0x8589427373D6D84E98730D7795D8f6f8731FDA16"
    }
```

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
