Generated with discovered.json: 0x51583b683443e64711cb4489838884c0f6e08e5e

# Diff at Thu, 23 Jul 2026 13:55:34 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@efd03446560a8d585747f124c71622cbfa33fca4 block: 1783509971
- current timestamp: 1784814834

## Description

22 pool rebalance routes were disabled by setting their destination tokens to the zero address.

## Watched changes

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      values.poolRebalanceRoutes.Ethereum.5.destinationToken:
-        "eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.4.destinationToken:
-        "eth:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Polygon PoS.4.destinationToken:
-        "eth:0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Polygon PoS.5.destinationToken:
-        "eth:0x1FcbE5937B0cc2adf69772D228fA4205aCF4D9b2"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.0.destinationToken:
-        "eth:0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.1.destinationToken:
-        "eth:0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.2.destinationToken:
-        "eth:0xdc0486f8bf31DF57a952bcd3c1d3e166e3d9eC8b"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.3.destinationToken:
-        "eth:0x780f33Ad21314d9A1Ffb6867Fe53d48a76Ec0D16"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.4.destinationToken:
-        "eth:0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.5.destinationToken:
-        "eth:0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.6.destinationToken:
-        "eth:0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Boba.7.destinationToken:
-        "eth:0x96821b258955587069F680729cD77369C0892B40"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.ZKsync Era.4.destinationToken:
-        "eth:0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Lisk.0.destinationToken:
-        "eth:0x4200000000000000000000000000000000000006"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Lisk.1.destinationToken:
-        "eth:0x05D032ac25d322df992303dCa074EE7392C117b9"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Lisk.3.destinationToken:
-        "eth:0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Lisk.4.destinationToken:
-        "eth:0xF242275d3a6527d877f2c927a82D9b057609cc71"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Base.2.destinationToken:
-        "eth:0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Arbitrum One.3.destinationToken:
-        "eth:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Linea.0.destinationToken:
-        "eth:0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Zora.0.destinationToken:
-        "eth:0x4200000000000000000000000000000000000006"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Zora.1.destinationToken:
-        "eth:0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

Generated with discovered.json: 0x8354005005099c44015c883895b884324c20a8fb

# Diff at Wed, 08 Jul 2026 12:42:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b07b540456fadbe70953a62e508fc92311c971c6 block: 1782464735
- current timestamp: 1783509971

## Description

7702 delegation of the `protocolFeeCaptureAddress` EOA.

some `poolRebalanceRoutes` (UMA v1, ACX,..) are routed to the zero address, meaning they are now unsupported.

## Watched changes

```diff
    EOA  (eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D) {
    +++ description: None
      sourceHashes.0:
-        "0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"
+        "0x3e6b48b0583e724b7006fcec0d9a021abd698deb8f7699582cdfee96bd65db4f"
      values.$implementation:
-        "eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B"
+        "eth:0x69007702764179f14F51cdce752f4f775d74E139"
      values.delegationManager:
-        "eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3"
      values.DOMAIN_VERSION:
-        "1"
      values.eip712Domain:
-        {"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]}
      values.getDeposit:
-        0
      values.getDomainHash:
-        "0x3818b9766109877e09a9c427e7b310cde355550731129529095a7e6b02cf55ab"
      values.getNonce:
-        0
      values.NAME:
-        "EIP7702StatelessDeleGator"
      values.PACKED_USER_OP_TYPEHASH:
-        "0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18"
      values.VERSION:
-        "1.3.0"
      values.accountId:
+        "alchemy.sma-7702.1.0.0"
      values.getFallbackSignerData:
+        ["eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D",false]
    }
```

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      values.Adapters.Avalanche:
+        "eth:0x1af659333172DC502bD71Cf5b889521C97751838"
      values.CrossChainContracts.Avalanche:
+        "eth:0xFE9D541c92E4e90437C7152A00244886dE37a658"
      values.poolRebalanceRoutes.Ethereum.3.destinationToken:
-        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Ethereum.9.destinationToken:
-        "eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Ethereum.13.destinationToken:
-        "eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.3.destinationToken:
-        "eth:0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.7.destinationToken:
-        "eth:0xFf733b2A3557a7ed6697007ab5D11B79FdD1b76B"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Polygon PoS.3.destinationToken:
-        "eth:0x3066818837c5e6eD6601bd5a91B0762877A6B731"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Polygon PoS.8.destinationToken:
-        "eth:0xF328b73B6c685831F238c30a23Fc19140CB4D8FC"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Lens.1.destinationToken:
-        "eth:0x6bDc36E20D267Ff0dd6097799f82e78907105e2F"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Arbitrum One.5.destinationToken:
-        "eth:0xd693Ec944A85eeca4247eC1c3b130DCa9B0C3b22"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Arbitrum One.8.destinationToken:
-        "eth:0x53691596d1BCe8CEa565b84d4915e69e03d9C99d"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract Avalance_Adapter (eth:0x1af659333172DC502bD71Cf5b889521C97751838) [acrossv3/universalAdapter]
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

## Source code changes

```diff
.../src/projects/across/.flat/Avalance_Adapter.sol | 1416 ++++++++++++++++++++
 1 file changed, 1416 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1782464735 (main branch discovery), not current.

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      usedTypes.1.arg.43114:
+        "Avalanche"
    }
```

Generated with discovered.json: 0x63d03bb2bd33d381c000e8af591b3b28e5801b78

# Diff at Fri, 26 Jun 2026 09:06:40 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@cf24a6eb45e0c4c6be4d66ee4e477ba0cce45b01 block: 1779355521
- current timestamp: 1782464735

## Description

Address PR review feedback:
- `AcrossBondToken` proposers permission is deduped into a single description that clarifies the two-level settlement model: proposals are bonded with ABT and settle optimistically on the HubPool with no UMA involvement; UMA token voting only kicks in when a dispute is raised via `disputeRootBundle()` within the challenge period.
- Universal-adapter descriptions: replace the `{{DATA_STORE}}` template placeholder, which was rendering as a raw `eth:0x…` address, with the literal contract name `HubPoolStore` so the prose reads naturally.

Also catches up to onchain state since the last main discovery: two newly registered chain mappings (`CrossChainContracts` + `Adapters`) and a couple of `poolRebalanceRoutes` re-points/disables.

## Watched changes

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      values.Adapters.4663:
+        "eth:0xbc5E82035e2C8d4B335Ccb751D6BF47e44Dec678"
      values.Adapters.5042:
+        "eth:0xCA5f9960022078F3585a188e06F910eeC29c7eBD"
      values.CrossChainContracts.4663:
+        "eth:0xD29C85F15DF544bA632C9E25829fd29d767d7978"
      values.CrossChainContracts.5042:
+        "eth:0x9b4A302A548c7e313c2b74C461db7b84d3074A84"
      values.poolRebalanceRoutes.Ethereum.7.destinationToken:
-        "eth:0xba100000625a3754423978a60c9317c58a424e3D"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Ethereum.10.destinationToken:
-        "eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Ethereum.11.destinationToken:
-        "eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Ethereum.12.destinationToken:
-        "eth:0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Ethereum.15.destinationToken:
-        "eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.5.destinationToken:
-        "eth:0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.8.destinationToken:
-        "eth:0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.9.destinationToken:
-        "eth:0x395Ae52bB17aef68C2888d941736A71dC6d4e125"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.OP Mainnet.11.destinationToken:
-        "eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Polygon PoS.6.destinationToken:
-        "eth:0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Polygon PoS.9.destinationToken:
-        "eth:0x25788a1a171ec66Da6502f9975a15B609fF54CF6"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.World Chain.3.destinationToken:
-        "eth:0x7077C71B4AF70737a08287E279B717Dcf64fdC57"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Lisk.2.destinationToken:
-        "eth:0xac485391EB2d7D88253a7F1eF18C37f4242D1A24"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Base.3.destinationToken:
-        "eth:0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Base.4.destinationToken:
-        "eth:0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Base.5.destinationToken:
-        "eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Arbitrum One.6.destinationToken:
-        "eth:0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8"
+        "eth:0x0000000000000000000000000000000000000000"
      values.poolRebalanceRoutes.Arbitrum One.9.destinationToken:
-        "eth:0xCF934E2402A5e072928a39a956964eb8F2B5B79C"
+        "eth:0x0000000000000000000000000000000000000000"
    }
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0xbc5E82035e2C8d4B335Ccb751D6BF47e44Dec678) [acrossv3/universalAdapter]
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0xCA5f9960022078F3585a188e06F910eeC29c7eBD) [acrossv3/universalAdapter]
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

## Source code changes

```diff
...:0xCA5f9960022078F3585a188e06F910eeC29c7eBD.sol | 1416 ++++++++++++++++++++
 ...:0xbc5E82035e2C8d4B335Ccb751D6BF47e44Dec678.sol | 1416 ++++++++++++++++++++
 2 files changed, 2832 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779355521 (main branch discovery), not current.

```diff
    contract VotingV2 (eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac) [uma/VotingV2] {
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract HyperEVM_Adapter (eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to HyperEVM. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      name:
-        "Universal_Adapter"
+        "HyperEVM_Adapter"
      description:
-        "This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
+        "This adapter can be used to send messages / root bundles to HyperEVM. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract AcrossConfigStore (eth:0x3B03509645713718B78951126E0A6de6f10043f5) [acrossv3/AcrossConfigStore] {
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Registry (eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE) [uma/Registry] {
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Finder (eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3) [uma/Finder] {
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract AdapterStore (eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b) [acrossv3/AdapterStore] {
    +++ description: A helper contract for chain adapters on the hub chain that support OFT messaging. Handles token -> messenger mapping.
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Tempo_Adapter (eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      name:
-        "Universal_Adapter"
+        "Tempo_Adapter"
      description:
-        "This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
+        "This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract Store (eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF) [uma/Store] {
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Ethereum_SpokePool (eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) [acrossv3/SpokePool] {
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
      fieldMeta.owner:
-        {"severity":"HIGH"}
      fieldMeta.crossDomainAdmin:
+        {"severity":"HIGH"}
      usedTypes:
+        [{"typeCaster":"ChainPrefix","arg":{"prefix":"eth"}}]
    }
```

```diff
    contract Lens_Adapter (eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      name:
-        "ZkStack_CustomGasToken_Adapter"
+        "Lens_Adapter"
    }
```

```diff
    contract BNBSmartChain_Adapter (eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
      name:
-        "Universal_Adapter"
+        "BNBSmartChain_Adapter"
      description:
-        "This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero."
+        "This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract UMA Multisig (eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) [GnosisSafe] {
    +++ description: None
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract OptimisticGovernor (eth:0x8692B776d1Ff0664177c90465038056Dc64f8991) [uma/OptimisticGovernor] {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
      receivedPermissions.0:
+        {"permission":"interact","from":"eth:0x3B03509645713718B78951126E0A6de6f10043f5","description":"update configuration values.","role":".owner","via":[{"address":"eth:0xB524735356985D2f267FA010D681f061DfF03715","delay":172800}]}
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b","description":"set the token-to-messenger mappings that adapters use to route OFT cross-chain transfers.","role":".owner","via":[{"address":"eth:0xB524735356985D2f267FA010D681f061DfF03715","delay":172800}]}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","description":"relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target).","role":".crossDomainAdmin","via":[{"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"},{"address":"eth:0xB524735356985D2f267FA010D681f061DfF03715","delay":172800}]}
      receivedPermissions.3:
+        {"permission":"interact","from":"eth:0x8692B776d1Ff0664177c90465038056Dc64f8991","description":"set guard, avatar, target, delay, identifier, escalationManager, bond token and amount.","role":".owner","via":[{"address":"eth:0xB524735356985D2f267FA010D681f061DfF03715","delay":172800}]}
      receivedPermissions.4:
+        {"permission":"interact","from":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda","description":"pause the system, manage all fees, bonds and security parameters, manage tokens and chain support, and critical emergency actions like admin functions on remote SpokePools or deleting proposals (can steal funds).","role":".owner","via":[{"address":"eth:0xB524735356985D2f267FA010D681f061DfF03715","delay":172800}]}
      receivedPermissions.0.via.0.delay:
+        172800
      receivedPermissions.0.description:
-        "update configuration values."
+        "manage the proposer role."
      receivedPermissions.0.from:
-        "eth:0x3B03509645713718B78951126E0A6de6f10043f5"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      receivedPermissions.1.via.0.delay:
+        172800
      receivedPermissions.1.via.0:
+        {"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}
      receivedPermissions.1.role:
-        ".owner"
+        ".crossDomainAdmin"
      receivedPermissions.1.description:
-        "set guard, avatar, target, delay, identifier, escalationManager, bond token and amount."
+        "relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target)."
      receivedPermissions.1.from:
-        "eth:0x8692B776d1Ff0664177c90465038056Dc64f8991"
+        "oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      receivedPermissions.2.via.0.delay:
+        172800
      receivedPermissions.2.via.0:
+        {"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}
      receivedPermissions.2.role:
-        ".owner"
+        ".crossDomainAdmin"
      receivedPermissions.2.description:
-        "pause the system, manage all fees, bonds and security parameters, manage tokens and chain support, and critical emergency actions like admin functions on remote SpokePools or deleting proposals (can steal funds)."
+        "upgrade the SpokePool implementation. The admin is the HubPool on Ethereum; for L2 SpokePools it acts cross-chain via the canonical messenger."
      receivedPermissions.2.from:
-        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      receivedPermissions.2.permission:
-        "interact"
+        "upgrade"
      receivedPermissions.3.via.0.delay:
+        172800
      receivedPermissions.3.via.0:
+        {"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}
      receivedPermissions.3.role:
-        ".owner"
+        ".crossDomainAdmin"
      receivedPermissions.3.description:
-        "manage the proposer role."
+        "upgrade the SpokePool implementation. The admin is the HubPool on Ethereum; for L2 SpokePools it acts cross-chain via the canonical messenger."
      receivedPermissions.3.from:
-        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      receivedPermissions.3.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.0.delay:
+        172800
      category:
+        {"name":"Governance","priority":3}
    }
```

```diff
    contract Unichain_Adapter (eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      name:
-        "DoctorWho_Adapter"
+        "Unichain_Adapter"
    }
```

```diff
    contract EmergencyProposer (eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) [uma/EmergencyProposer] {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract FixedSlashSlashingLibrary (eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd) [uma/FixedSlashSlashingLibrary] {
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract Tron_Adapter (eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Tron. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      name:
-        "Universal_Adapter"
+        "Tron_Adapter"
      description:
-        "This adapter can be used to send messages / root bundles to Tron. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
+        "This adapter can be used to send messages / root bundles to Tron. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract ZkSyncEra_Adapter (eth:0xA374585E6062517Ee367ee5044946A6fBe17724f) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      name:
-        "ZkStack_Adapter"
+        "ZkSyncEra_Adapter"
    }
```

```diff
    contract Plasma_Adapter (eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
      name:
-        "Universal_Adapter"
+        "Plasma_Adapter"
      description:
-        "This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero."
+        "This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract Across Multisig (eth:0xB524735356985D2f267FA010D681f061DfF03715) [GnosisSafe] {
    +++ description: None
      receivedPermissions.1:
+        {"permission":"interact","from":"eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b","description":"set the token-to-messenger mappings that adapters use to route OFT cross-chain transfers.","role":".owner"}
      receivedPermissions.2:
+        {"permission":"interact","from":"eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","description":"relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target).","role":".crossDomainAdmin","via":[{"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}]}
      receivedPermissions.6:
+        {"permission":"interact","from":"oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281","description":"relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target).","role":".crossDomainAdmin","via":[{"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}]}
      receivedPermissions.7:
+        {"permission":"upgrade","from":"eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","description":"upgrade the SpokePool implementation. The admin is the HubPool on Ethereum; for L2 SpokePools it acts cross-chain via the canonical messenger.","role":".crossDomainAdmin","via":[{"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}]}
      receivedPermissions.8:
+        {"permission":"upgrade","from":"oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281","description":"upgrade the SpokePool implementation. The admin is the HubPool on Ethereum; for L2 SpokePools it acts cross-chain via the canonical messenger.","role":".crossDomainAdmin","via":[{"address":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"}]}
      category:
+        {"name":"Governance","priority":3}
      directlyReceivedPermissions:
+        [{"permission":"act","from":"eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda","role":".owner"}]
    }
```

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      directlyReceivedPermissions.0:
+        {"permission":"interact","from":"eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","description":"relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target).","role":".crossDomainAdmin"}
      directlyReceivedPermissions.1:
+        {"permission":"interact","from":"oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281","description":"relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target).","role":".crossDomainAdmin"}
      directlyReceivedPermissions.0.role:
-        ".owner"
+        ".crossDomainAdmin"
      directlyReceivedPermissions.0.description:
-        "relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target)."
+        "upgrade the SpokePool implementation. The admin is the HubPool on Ethereum; for L2 SpokePools it acts cross-chain via the canonical messenger."
      directlyReceivedPermissions.0.permission:
-        "interact"
+        "upgrade"
      directlyReceivedPermissions.1.description:
+        "upgrade the SpokePool implementation. The admin is the HubPool on Ethereum; for L2 SpokePools it acts cross-chain via the canonical messenger."
      directlyReceivedPermissions.1.role:
-        "admin"
+        ".crossDomainAdmin"
      directlyReceivedPermissions.1.from:
-        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
+        "oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.Adapters.1:
-        "eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084"
      values.Adapters.10:
-        "eth:0x3562e309C6C79626E5F0Cf746FB5Bf4f6b8EebE5"
      values.Adapters.56:
-        "eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b"
      values.Adapters.130:
-        "eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1"
      values.Adapters.137:
-        "eth:0x537abE038C223066B50312474409924487D2E655"
      values.Adapters.143:
-        "eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452"
      values.Adapters.232:
-        "eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
      values.Adapters.288:
-        "eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3"
      values.Adapters.324:
-        "eth:0xA374585E6062517Ee367ee5044946A6fBe17724f"
      values.Adapters.480:
-        "eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
      values.Adapters.690:
-        "eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
      values.Adapters.999:
-        "eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B"
      values.Adapters.1135:
-        "eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
      values.Adapters.1868:
-        "eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
      values.Adapters.4217:
-        "eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c"
      values.Adapters.4326:
-        "eth:0xE1f04404b74F996A311F13aE291849fC153578Ac"
      values.Adapters.8453:
-        "eth:0x799BDC55d91864b14B2eD63A34DeF5d502AA897f"
      values.Adapters.9745:
-        "eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363"
      values.Adapters.34443:
-        "eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0"
      values.Adapters.41455:
-        "eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
      values.Adapters.42161:
-        "eth:0xc0b6d2f794cc787C71f2cA5ceCD57102C32379B3"
      values.Adapters.57073:
-        "eth:0x545E43B6eC2f9a44CAa531298699Ff05958670B5"
      values.Adapters.59144:
-        "eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
      values.Adapters.81457:
-        "eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
      values.Adapters.534352:
-        "eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8"
      values.Adapters.7777777:
-        "eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
      values.Adapters.728126428:
-        "eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db"
      values.Adapters.34268394551451:
-        "eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
      values.Adapters.Ethereum:
+        "eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084"
      values.Adapters.OP Mainnet:
+        "eth:0x3562e309C6C79626E5F0Cf746FB5Bf4f6b8EebE5"
      values.Adapters.BNB Smart Chain:
+        "eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b"
      values.Adapters.Unichain:
+        "eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1"
      values.Adapters.Polygon PoS:
+        "eth:0x537abE038C223066B50312474409924487D2E655"
      values.Adapters.Monad:
+        "eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452"
      values.Adapters.Lens:
+        "eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
      values.Adapters.Boba:
+        "eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3"
      values.Adapters.ZKsync Era:
+        "eth:0xA374585E6062517Ee367ee5044946A6fBe17724f"
      values.Adapters.World Chain:
+        "eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
      values.Adapters.Redstone:
+        "eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
      values.Adapters.HyperEVM:
+        "eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B"
      values.Adapters.Lisk:
+        "eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
      values.Adapters.Soneium:
+        "eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
      values.Adapters.Tempo:
+        "eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c"
      values.Adapters.MegaETH:
+        "eth:0xE1f04404b74F996A311F13aE291849fC153578Ac"
      values.Adapters.Base:
+        "eth:0x799BDC55d91864b14B2eD63A34DeF5d502AA897f"
      values.Adapters.Plasma:
+        "eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363"
      values.Adapters.Mode:
+        "eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0"
      values.Adapters.Aleph Zero:
+        "eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
      values.Adapters.Arbitrum One:
+        "eth:0xc0b6d2f794cc787C71f2cA5ceCD57102C32379B3"
      values.Adapters.Ink:
+        "eth:0x545E43B6eC2f9a44CAa531298699Ff05958670B5"
      values.Adapters.Linea:
+        "eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
      values.Adapters.Blast:
+        "eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
      values.Adapters.Scroll:
+        "eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8"
      values.Adapters.Zora:
+        "eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
      values.Adapters.Tron:
+        "eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db"
      values.Adapters.Solana:
+        "eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
      values.CrossChainContracts.1:
-        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.CrossChainContracts.10:
-        "eth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.CrossChainContracts.56:
-        "eth:0x4e8E101924eDE233C13e2D8622DC8aED2872d505"
      values.CrossChainContracts.130:
-        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.137:
-        "eth:0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
      values.CrossChainContracts.143:
-        "eth:0xd2ecb3afe598b746F8123CaE365a598DA831A449"
      values.CrossChainContracts.232:
-        "eth:0xb234cA484866c811d0e6D3318866F583781ED045"
      values.CrossChainContracts.288:
-        "eth:0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"
      values.CrossChainContracts.324:
-        "eth:0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"
      values.CrossChainContracts.480:
-        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.690:
-        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.999:
-        "eth:0x35E63eA3eb0fb7A3bc543C71FB66412e1F6B0E04"
      values.CrossChainContracts.1135:
-        "eth:0x9552a0a6624A23B848060AE5901659CDDa1f83f8"
      values.CrossChainContracts.1868:
-        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.4217:
-        "eth:0x2d4710F04Da90184255782d3715224A6C776955D"
      values.CrossChainContracts.4326:
-        "eth:0x3Db06DA8F0a24A525f314eeC954fC5c6a973d40E"
      values.CrossChainContracts.8453:
-        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.9745:
-        "eth:0x50039fAEfebef707cFD94D6d462fE6D10B39207a"
      values.CrossChainContracts.34443:
-        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.41455:
-        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.42161:
-        "eth:0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"
      values.CrossChainContracts.57073:
-        "eth:0xeF684C38F94F48775959ECf2012D7E864ffb9dd4"
      values.CrossChainContracts.59144:
-        "eth:0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"
      values.CrossChainContracts.81457:
-        "eth:0x2D509190Ed0172ba588407D4c2df918F955Cc6E1"
      values.CrossChainContracts.534352:
-        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.7777777:
-        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.728126428:
-        "eth:0xc148aF9B50Bc03Cc0c616Cd85C66Aae9bD90cD80"
      values.CrossChainContracts.34268394551451:
-        "eth:0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
      values.CrossChainContracts.Ethereum:
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.CrossChainContracts.OP Mainnet:
+        "eth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.CrossChainContracts.BNB Smart Chain:
+        "eth:0x4e8E101924eDE233C13e2D8622DC8aED2872d505"
      values.CrossChainContracts.Unichain:
+        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.Polygon PoS:
+        "eth:0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
      values.CrossChainContracts.Monad:
+        "eth:0xd2ecb3afe598b746F8123CaE365a598DA831A449"
      values.CrossChainContracts.Lens:
+        "eth:0xb234cA484866c811d0e6D3318866F583781ED045"
      values.CrossChainContracts.Boba:
+        "eth:0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"
      values.CrossChainContracts.ZKsync Era:
+        "eth:0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"
      values.CrossChainContracts.World Chain:
+        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.Redstone:
+        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.HyperEVM:
+        "eth:0x35E63eA3eb0fb7A3bc543C71FB66412e1F6B0E04"
      values.CrossChainContracts.Lisk:
+        "eth:0x9552a0a6624A23B848060AE5901659CDDa1f83f8"
      values.CrossChainContracts.Soneium:
+        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.Tempo:
+        "eth:0x2d4710F04Da90184255782d3715224A6C776955D"
      values.CrossChainContracts.MegaETH:
+        "eth:0x3Db06DA8F0a24A525f314eeC954fC5c6a973d40E"
      values.CrossChainContracts.Base:
+        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.Plasma:
+        "eth:0x50039fAEfebef707cFD94D6d462fE6D10B39207a"
      values.CrossChainContracts.Mode:
+        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.Aleph Zero:
+        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.Arbitrum One:
+        "eth:0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"
      values.CrossChainContracts.Ink:
+        "eth:0xeF684C38F94F48775959ECf2012D7E864ffb9dd4"
      values.CrossChainContracts.Linea:
+        "eth:0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"
      values.CrossChainContracts.Blast:
+        "eth:0x2D509190Ed0172ba588407D4c2df918F955Cc6E1"
      values.CrossChainContracts.Scroll:
+        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.Zora:
+        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.Tron:
+        "eth:0xc148aF9B50Bc03Cc0c616Cd85C66Aae9bD90cD80"
      values.CrossChainContracts.Solana:
+        "eth:0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
      values.optimismSpokePool:
+        "oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.pooledTokens:
+        [{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","lpToken":"eth:0x28F77208728B0A45cAb24c4868334581Fe86F95B"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","lpToken":"eth:0xC9b09405959f63F72725828b5d449488b02be1cA"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","lpToken":"eth:0x59C1427c658E97a7d568541DaC780b2E5c8affb4"},{"l1Token":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828","lpToken":"eth:0xB9921d28466304103a233fcD071833e498f12853"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","lpToken":"eth:0x4FaBacAC8C41466117D6A38F46d08ddD4948A0cB"},{"l1Token":"eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc","lpToken":"eth:0x9306B6f45263f8cB6a18EFF127313d10D06FcCB5"},{"l1Token":"eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d","lpToken":"eth:0xb5124b9Ae9efeA2ADD1FF768EEc75095e8d9D532"},{"l1Token":"eth:0xba100000625a3754423978a60c9317c58a424e3D","lpToken":"eth:0xfacd2eC4647df2Cb758F684C2aAAB56A93288f9e"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","lpToken":"eth:0xC2faB88f215f62244d2E32c8a65E8F58DA8415a5"},{"l1Token":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F","lpToken":"eth:0xb0C8fEf534223B891D4A430e49537143829c4817"},{"l1Token":"eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F","lpToken":"eth:0xe480f5A42E263ac0352D0c9C6e75C4A612eE52A7"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","lpToken":"eth:0xC3f35d90EbCE372ded12029b72B22a23A2F637fD"},{"l1Token":"eth:0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f","lpToken":"eth:0xfd4a46D76Fb8fc13F5a77883519A0cfB656D3BEc"},{"l1Token":"eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a","lpToken":"eth:0xA6ABcB5530770C32fd489eBD90D29Cde99d91d7F"},{"l1Token":"eth:0x163f8C2467924be0ae7B5347228CABF260318753","lpToken":"eth:0x933f3Dd62F33f6f65C5fB5f33ED2c2f32d392372"},{"l1Token":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74","lpToken":"eth:0x8d29B8f64237cf39E93111a96A73e5dC03Eb612d"}]
      values.poolRebalanceRoutes:
+        {"Ethereum":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"},{"l1Token":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828","destinationToken":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"},{"l1Token":"eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc","destinationToken":"eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"},{"l1Token":"eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d","destinationToken":"eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d"},{"l1Token":"eth:0xba100000625a3754423978a60c9317c58a424e3D","destinationToken":"eth:0xba100000625a3754423978a60c9317c58a424e3D"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"},{"l1Token":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F","destinationToken":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"},{"l1Token":"eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F","destinationToken":"eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"},{"l1Token":"eth:0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f","destinationToken":"eth:0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f"},{"l1Token":"eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a","destinationToken":"eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a"},{"l1Token":"eth:0x163f8C2467924be0ae7B5347228CABF260318753","destinationToken":"eth:0x163f8C2467924be0ae7B5347228CABF260318753"},{"l1Token":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74","destinationToken":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74"}],"OP Mainnet":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x68f180fcCe6836688e9084f035309E29Bf0A2095"},{"l1Token":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828","destinationToken":"eth:0xE7798f023fC62146e8Aa1b36Da45fb70855a77Ea"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"},{"l1Token":"eth:0xba100000625a3754423978a60c9317c58a424e3D","destinationToken":"eth:0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"},{"l1Token":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F","destinationToken":"eth:0xFf733b2A3557a7ed6697007ab5D11B79FdD1b76B"},{"l1Token":"eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F","destinationToken":"eth:0x8700dAec35aF8Ff88c16BdF0418774CB3D7599B4"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0x395Ae52bB17aef68C2888d941736A71dC6d4e125"},{"l1Token":"eth:0x163f8C2467924be0ae7B5347228CABF260318753","destinationToken":"eth:0xdC6fF44d5d932Cbd77B52E5612Ba0529DC6226F1"},{"l1Token":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74","destinationToken":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74"}],"Unichain":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x078D782b760474a361dDA0AF3839290b0EF57AD6"}],"Polygon PoS":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6"},{"l1Token":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828","destinationToken":"eth:0x3066818837c5e6eD6601bd5a91B0762877A6B731"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"},{"l1Token":"eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d","destinationToken":"eth:0x1FcbE5937B0cc2adf69772D228fA4205aCF4D9b2"},{"l1Token":"eth:0xba100000625a3754423978a60c9317c58a424e3D","destinationToken":"eth:0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xc2132D05D31c914a87C6611C10748AEb04B58e8F"},{"l1Token":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F","destinationToken":"eth:0xF328b73B6c685831F238c30a23Fc19140CB4D8FC"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0x25788a1a171ec66Da6502f9975a15B609fF54CF6"}],"Monad":[{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x754704Bc059F8C67012fEd69BC8A327a5aafb603"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xe7cd86e13AC4309349F30B3435a9d337750fC82D"}],"Lens":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0xE5ecd226b3032910CEaa43ba92EE8232f8237553"},{"l1Token":"eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a","destinationToken":"eth:0x6bDc36E20D267Ff0dd6097799f82e78907105e2F"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884"}],"Boba":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0xdc0486f8bf31DF57a952bcd3c1d3e166e3d9eC8b"},{"l1Token":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828","destinationToken":"eth:0x780f33Ad21314d9A1Ffb6867Fe53d48a76Ec0D16"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35"},{"l1Token":"eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc","destinationToken":"eth:0xa18bF3994C0Cc6E3b63ac420308E5383f53120D7"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0x5DE1677344D3Cb0D7D465c10b72A8f60699C062d"},{"l1Token":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F","destinationToken":"eth:0x96821b258955587069F680729cD77369C0892B40"}],"ZKsync Era":[{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0x493257fD37EDB34451f62EDf8D2a0C418852bA4C"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0xBBeB516fb02a01611cBBE0453Fe3c580D7281011"},{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656"}],"World Chain":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x79A02482A880bCE3F13e09Da970dC34db4CD24d1"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0x7077C71B4AF70737a08287E279B717Dcf64fdC57"},{"l1Token":"eth:0x163f8C2467924be0ae7B5347228CABF260318753","destinationToken":"eth:0x2cFc85d8E48F8EAB294be644d9E25C3030863003"}],"Redstone":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x0000000000000000000000000000000000000000"}],"HyperEVM":[{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xb88339CB7199b77E23DB6E890353E22632Ba630f"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb"}],"Lisk":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0x05D032ac25d322df992303dCa074EE7392C117b9"},{"l1Token":"eth:0x6033F7f88332B8db6ad452B7C6D5bB643990aE3f","destinationToken":"eth:0xac485391EB2d7D88253a7F1eF18C37f4242D1A24"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x03C7054BCB39f7b2e5B2c7AcB37583e32D70Cfa3"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xF242275d3a6527d877f2c927a82D9b057609cc71"}],"Soneium":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xbA9986D2381edf1DA03B0B9c1f8b00dc4AacC369"}],"MegaETH":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"}],"Base":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb"},{"l1Token":"eth:0xba100000625a3754423978a60c9317c58a424e3D","destinationToken":"eth:0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0xd652C5425aea2Afd5fb142e120FeCf79e18fafc3"},{"l1Token":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74","destinationToken":"eth:0x4e107a0000DB66f0E9Fd2039288Bf811dD1f9c74"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2"}],"Plasma":[{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb"}],"Mode":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xd988097fb8612cc24eeC14542bC03424c656005f"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xf0F161fDA2712DB8b566946122a5af183995e2eD"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0xcDd475325D6F564d27247D1DddBb0DAc6fA0a5CF"}],"Aleph Zero":[{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0x0000000000000000000000000000000000000000"},{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x0000000000000000000000000000000000000000"}],"Arbitrum One":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xaf88d065e77c8cC2239327C5EDb3A432268e5831"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1"},{"l1Token":"eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d","destinationToken":"eth:0xBfa641051Ba0a0Ad1b0AcF549a89536A0D76472E"},{"l1Token":"eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828","destinationToken":"eth:0xd693Ec944A85eeca4247eC1c3b130DCa9B0C3b22"},{"l1Token":"eth:0xba100000625a3754423978a60c9317c58a424e3D","destinationToken":"eth:0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9"},{"l1Token":"eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F","destinationToken":"eth:0x53691596d1BCe8CEa565b84d4915e69e03d9C99d"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0xCF934E2402A5e072928a39a956964eb8F2B5B79C"}],"Ink":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x2D270e6886d130D724215A266106e6832161EAEd"}],"Linea":[{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0x4AF15ec2A0BD43Db75dd04E62FAA3B8EF36b00d5"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0xA219439258ca9da29E9Cc4cE5596924745e12B93"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x176211869cA2b568f2A7D4EE941E073a821EE1ff"},{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34f"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b4"}],"Blast":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4300000000000000000000000000000000000004"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692"},{"l1Token":"eth:0x6B175474E89094C44Da98b954EedeAC495271d0F","destinationToken":"eth:0x4300000000000000000000000000000000000003"}],"Scroll":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x0000000000000000000000000000000000000000"},{"l1Token":"eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599","destinationToken":"eth:0x0000000000000000000000000000000000000000"},{"l1Token":"eth:0xdAC17F958D2ee523a2206206994597C13D831ec7","destinationToken":"eth:0x0000000000000000000000000000000000000000"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0x0000000000000000000000000000000000000000"},{"l1Token":"eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e","destinationToken":"eth:0x0000000000000000000000000000000000000000"}],"Zora":[{"l1Token":"eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2","destinationToken":"eth:0x4200000000000000000000000000000000000006"},{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xCccCCccc7021b32EBb4e8C08314bD62F7c653EC4"}],"Solana":[{"l1Token":"eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","destinationToken":"eth:0xaBc97431B1Bbe4C2D2f6E0E47ca60203452f5d61"}]}
      usedTypes.1:
+        {"typeCaster":"Mapping","arg":{"1":"Ethereum","10":"OP Mainnet","56":"BNB Smart Chain","130":"Unichain","137":"Polygon PoS","143":"Monad","232":"Lens","288":"Boba","324":"ZKsync Era","480":"World Chain","690":"Redstone","999":"HyperEVM","1135":"Lisk","1868":"Soneium","4217":"Tempo","4326":"MegaETH","8453":"Base","9745":"Plasma","34443":"Mode","41455":"Aleph Zero","42161":"Arbitrum One","57073":"Ink","59144":"Linea","81457":"Blast","534352":"Scroll","7777777":"Zora","728126428":"Tron","34268394551451":"Solana"}}
      usedTypes.2:
+        {"typeCaster":"ChainPrefix","arg":{"prefix":"oeth"}}
    }
```

```diff
    contract Monad_Adapter (eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      description:
-        "This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
+        "This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the HubPoolStore on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
      category.name:
-        "Local Infrastructure"
+        "External Bridges"
      category.priority:
-        5
+        1
    }
```

```diff
    contract IdentifierWhitelist (eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570) [uma/IdentifierWhitelist] {
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7) [uma/AddressWhitelist] {
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    contract MegaETH_Adapter (eth:0xE1f04404b74F996A311F13aE291849fC153578Ac) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      name:
-        "OP_Adapter"
+        "MegaETH_Adapter"
    }
```

```diff
    contract AcrossBondToken (ABT) (eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) [acrossv3/BondToken] {
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract SkinnyOptimisticOracle (eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24) [uma/SkinnyOptimisticOracle] {
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
    EOA  (eth:0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c) {
    +++ description: None
      receivedPermissions.0:
-        {"permission":"interact","from":"eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea","description":"Can propose new root bundles (containing settlement info to refund relayers), which are validated optimistically by the UMA oracle.","role":".proposers"}
      receivedPermissions.1.description:
-        "use ABT as a bond to the HubPool contract for root bundle proposals."
+        "propose new root bundles to the HubPool by posting an ABT bond. Proposals settle optimistically; only disputes (via `disputeRootBundle()`) escalate to UMA token voting."
    }
```

```diff
    contract OptimisticOracleV3 (eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) [uma/OptimisticOracleV3] {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      category:
+        {"name":"Shared Infrastructure","priority":4}
    }
```

```diff
+   Status: CREATED
    contract Optimism_SpokePool (oeth:0x6f26Bf09B1C792e3228e5467807a900A503c0281) [acrossv3/SpokePool]
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
```

Generated with discovered.json: 0xae75558b7abc3fe3e9245e4489f64b7c6548e94e

# Diff at Tue, 09 Jun 2026 12:43:30 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ae67a38d37457ad735e5d55080d2e5479d5df7dc block: 1779355521
- current timestamp: 1779355521

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1779355521 (main branch discovery), not current.

```diff
    EOA  (eth:0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c) {
    +++ description: None
      receivedPermissions.0.description:
+        "Can propose new root bundles (containing settlement info to refund relayers), which are validated optimistically by the UMA oracle."
      receivedPermissions.0.permission:
-        "acrossPropose"
+        "interact"
    }
```

Generated with discovered.json: 0x894e4eb696b7625cdb36481785432477e426b75c

# Diff at Thu, 21 May 2026 09:26:54 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@aa147da36dc2b8d307d8e09b17d18109b2286235 block: 1777369203
- current timestamp: 1779355521

## Description

spoke contract on tron updated.

## Watched changes

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      values.CrossChainContracts.728126428:
-        "eth:0x284352bb448C65b75EbE004862e4f4531042d628"
+        "eth:0xc148aF9B50Bc03Cc0c616Cd85C66Aae9bD90cD80"
    }
```

Generated with discovered.json: 0xdc112add3eec0ebe18ca57b97a994455c93b8aca

# Diff at Fri, 15 May 2026 12:35:36 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@a5152b9ba7ad7f85f2af3d814f74630fcaa7c917 block: 1777369203
- current timestamp: 1777369203

## Description

Shape hashes update after flattener improvements

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777369203 (main branch discovery), not current.

```diff
    EOA  (eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D) {
    +++ description: None
      sourceHashes.0:
-        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
+        "0x1f44812af62d28f019e30e8eb2af596fb36c7db9d34576972c0405e110a6ef45"
    }
```

Generated with discovered.json: 0xaa8d215fb8d76db1878cb20b4d1f50430b471b10

# Diff at Fri, 08 May 2026 07:51:00 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@488d190650457a1fba9b18a83f14a17ab8b2c84c block: 1777369203
- current timestamp: 1777369203

## Description

Use the new flattener implementation

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777369203 (main branch discovery), not current.

```diff
    contract VotingV2 (eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac) [uma/VotingV2] {
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
      sourceHashes.0:
-        "0xef18268ad698461591028993ca19fa3b717ace3ee3371f86e68c1d0a3658d87e"
+        "0x890304fa0fd0460cab5fbf8e0c6abdfd572bc495ea2e94c9661913ab191c07d0"
    }
```

```diff
    contract Zora_Adapter (eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x6d9e4b79712a4e81c51941fb986f4c55774da36be108106577ca01ccb35a0f87"
+        "0x4f6390935976074a5e55dd19deba114be9e108c6f2dc9e185d1f379eaa9b702b"
    }
```

```diff
    contract Soneium_Adapter (eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0xa11a006e88b4bc29596c25023695ef9026e9dc97dfd50ba059ee6b3e23a44008"
+        "0x6b7ccdb0b5af87e3b9ed000233ff71fa303f55dc611d3d720ee0c3f121fc8f3e"
    }
```

```diff
    contract Universal_Adapter (eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      sourceHashes.0:
-        "0x7ff8668a17d865513414130cf8749a6b7e7452c5ce078ffa50e1a7b74d7c333b"
+        "0x6ac887d101497a6fd8bdfbdb2a3f053e66c698ecfe7134dd3750f67a7e6f852b"
    }
```

```diff
    contract Redstone_Adapter (eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x0c32a0cfde3cb87843b5521bf184be1dd2b0031a8e91c2bc7885a2e10db010c1"
+        "0x00fd9d43c84d1b6249b59aa9283d8b5cd089cc0e27c0132b771c2d75510ea385"
    }
```

```diff
    contract Scroll_Adapter (eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x56586e3315f76ed277970410b47da25a0980ca9400f2a97fd38139e2a1f2dc5e"
+        "0x93ccb0e337fe5516163e1356eccae360ca8812a86c40056e16ab8cd83580eb65"
    }
```

```diff
    contract Boba_Adapter (eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x9f8b082009430546d55daaa8e166eca77ef9ca17f7831f03de4635bdc4a32b31"
+        "0x55d31f2397d3b9176e0f464294848cb9c966ca1da16222ae071cf9367a3e5f5c"
    }
```

```diff
    contract Optimism_Adapter (eth:0x3562e309C6C79626E5F0Cf746FB5Bf4f6b8EebE5) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0xbc0e9c23007f3c3c61476c843d07e2734aef4507d5180c4e849a4f48580101b7"
+        "0xb49a294f23bb8fae981af2f32df9760968a529b61ce5814fdcd2955d4c2ddb5e"
    }
```

```diff
    contract AcrossConfigStore (eth:0x3B03509645713718B78951126E0A6de6f10043f5) [acrossv3/AcrossConfigStore] {
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
      sourceHashes.0:
-        "0x926aa3c074cb5463671ec24c946524d9e03d3aa56a9847ca738b17b747c0e076"
+        "0x8e71981e7f96299c3df4231d2575850b96b6886aba88bb849d7722e2b0ed9deb"
    }
```

```diff
    contract Registry (eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE) [uma/Registry] {
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
      sourceHashes.0:
-        "0xc24ab9710d3eb0d1c35d298ecefe98096f87a672be7bd8051f9e86902122612f"
+        "0x84b10a5992ff1755ec96f16d3c3c50231ac9b37e5613e708ecfac6b19e050557"
    }
```

```diff
    contract AdapterStore (eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b) [acrossv3/AdapterStore] {
    +++ description: A helper contract for chain adapters on the hub chain that support OFT messaging. Handles token -> messenger mapping.
      sourceHashes.0:
-        "0x2f3eaca74d04678cd00ac7aba0a7b0a044ee7af9b1b0ffddcf1724c046dc62eb"
+        "0x791604b31fe2492c6f4abea96c41e9877375530d40ce0e192bc142d2b80cf10a"
    }
```

```diff
    contract Universal_Adapter (eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      sourceHashes.0:
-        "0x7ff8668a17d865513414130cf8749a6b7e7452c5ce078ffa50e1a7b74d7c333b"
+        "0x6ac887d101497a6fd8bdfbdb2a3f053e66c698ecfe7134dd3750f67a7e6f852b"
    }
```

```diff
    contract ProposerV2 (eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC) [uma/ProposerV2] {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      sourceHashes.0:
-        "0x28c93f7b68e31548857633c6cb61284d9d2860cc0fbbcaaede8f631d364d66a4"
+        "0xbdacadbba17cad853dc7f3b53a6777024fe1862785c8ded594d8dd386fb5ca63"
    }
```

```diff
    contract Ethereum_Adapter (eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x14afbe84cefefdcb06132c680d267b8892f0834a39fc23ca0ea563758653a21a"
+        "0xaa57840bcec6253310d5736266a04eff14edb6cbdaca4c5f76392054eefa4edc"
    }
```

```diff
    contract Polygon_Adapter (eth:0x537abE038C223066B50312474409924487D2E655) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x6e7fdec1dea08a851a5c7c7d013648db8f07fcd751548a002281e712f89f6c49"
+        "0x19f838047a4ea9f6166087f42d798199893dae3be4bae6c5ec8ce33e0ab17674"
    }
```

```diff
    contract Ink_Adapter (eth:0x545E43B6eC2f9a44CAa531298699Ff05958670B5) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0xbfd7166e5dce4fc403bfc9d03712390154e5aa737cb65ab10796605b28dc9e9e"
+        "0xd09d0d28995e5980f3ef0e5ae1c9d4b28d5d70043610e8cb52e5dd5e9b60e916"
    }
```

```diff
    contract Store (eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF) [uma/Store] {
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
      sourceHashes.0:
-        "0x6f43084dec3aeec07252527bcb44d7bfafac569030fc87e32d6a5661a0f3e0f1"
+        "0x6bb7c4fac4cb75daa96658bc6b24d696cc72b2ac4b72286cc47a776ba5648a3b"
    }
```

```diff
    contract Linea_Adapter (eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x0252bdb116e29cf6cc0b6de4ebf9589fcc53281458cb80f4db7a91a866d9eb46"
+        "0x320f883f620cbb7a377265c28d963349af796f667b09d772c6c22c00f98fb136"
    }
```

```diff
    contract Ethereum_SpokePool (eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) [acrossv3/SpokePool] {
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
      sourceHashes.0:
-        "0x669da4e91a9ad0ca23205a174e7f8931e4d7d128453132164ba6458f11f15c72"
+        "0xd2812a145d2b7f3e3e1571f68022076a2cccd5fe82f8035d427714135197a6f1"
      sourceHashes.1:
-        "0x51fe389d737f63ba780131cbcd7de767178890a9783c26f10a7914e04b8cccf8"
+        "0x7c82111265c69f8a894d8029e30766541164d55fb1e814bf29ddacecaeee12c1"
    }
```

```diff
    contract ZkStack_CustomGasToken_Adapter (eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x949e41ae655aafeb048cfa1c491186b6582bd4f6028227ed0ce17a012456e675"
+        "0x85648815e28158a5c0659f1200fa6f486406f3ef69fb2c045129c5ab14653f75"
    }
```

```diff
    contract Universal_Adapter (eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
      sourceHashes.0:
-        "0x7ff8668a17d865513414130cf8749a6b7e7452c5ce078ffa50e1a7b74d7c333b"
+        "0x6ac887d101497a6fd8bdfbdb2a3f053e66c698ecfe7134dd3750f67a7e6f852b"
    }
```

```diff
    contract Alephzero_Adapter (eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x1ccce681c671e5131c390787ccaa619eb4c4ee20d444e73484078b4770b12ea1"
+        "0xca3522b17a94cef6f519f34ec72ca7a7294b884761d47a60eedba59e7cf38b9d"
    }
```

```diff
    contract Base_Adapter (eth:0x799BDC55d91864b14B2eD63A34DeF5d502AA897f) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x235e6017ab764deb7de4cf894fc0b8d15bebacad6ff219fc122864ee964bf523"
+        "0xacd8d420b2b79b9a74f15259c503b84e2dc0b2d54e116aeae0d204e23e79aea7"
    }
```

```diff
    contract GovernorV2 (eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8) [uma/GovernorV2] {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      sourceHashes.0:
-        "0xdf7f17e5c8ba1f0103fcfaf495da624089f8bfb3d5052217537bb064ca8c60b9"
+        "0x0c1bbf4432b7c167c329d7556367b2a74b4638207a1bd6802f271b409ddea670"
    }
```

```diff
    contract UMA Multisig (eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract OptimisticGovernor (eth:0x8692B776d1Ff0664177c90465038056Dc64f8991) [uma/OptimisticGovernor] {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
      sourceHashes.0:
-        "0xcecd27c998c8fd83d7532693da2bdff346a1dbedbaab4744f21d2bcf1986e9de"
+        "0xff0641accc9447247f5ac1710b7b0d51e1441fabce1ca46f56f3654e6a13c4a2"
    }
```

```diff
    contract DoctorWho_Adapter (eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x4fed24508db075cc7ece3f2b393b38baa14d83cb16b7435622c6b3b7a2af178f"
+        "0xc313ad89f863c556da5ab53674479545a49178f3feb38c1d8babb8a8180673b4"
    }
```

```diff
    contract WorldChain_Adapter (eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x1cb72676cfb98558060e29bb95cd793731c85797f35025b1f2dfb383499f55a3"
+        "0x2b7b6e36efba9662d0c39439d22db847b7e6f11785852339ee909ac40034dede"
    }
```

```diff
    contract EmergencyProposer (eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) [uma/EmergencyProposer] {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      sourceHashes.0:
-        "0x435ceb597bcf7bd820f593bdbc0e3ce4d223cc2203b368911d2b29fa6bc5e048"
+        "0x877d9748e150bf89ecee6f6c42014a47405d4093a003904ec87bea291ebf19e0"
    }
```

```diff
    EOA  (eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D) {
    +++ description: None
      sourceHashes.0:
-        "0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"
+        "0x6fcf212849ffbf34d907a048df4d05a6c97f876a620c7386a770735262604c54"
    }
```

```diff
    contract Solana_Adapter (eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3) [acrossv3/Adapter] {
    +++ description: Adapter for Solana. Uses CCTP v1 AMB to relay root bundles to the Solana spokepool.
      sourceHashes.0:
-        "0xd9ba616630e494fc819ca66efe5c5ed40e5ed274cb568c605ecf8a609d88f738"
+        "0x64f26bb547fa35dd225c9d4dcdf35c6525bbc7bd5e99671f2135f4dde392f0b6"
    }
```

```diff
    contract Universal_Adapter (eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Tron. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      sourceHashes.0:
-        "0x7ff8668a17d865513414130cf8749a6b7e7452c5ce078ffa50e1a7b74d7c333b"
+        "0x6ac887d101497a6fd8bdfbdb2a3f053e66c698ecfe7134dd3750f67a7e6f852b"
    }
```

```diff
    contract ZkStack_Adapter (eth:0xA374585E6062517Ee367ee5044946A6fBe17724f) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x6b9289adba88945bc716d68cbdde1a68c52429766cef73d7c17fe4ca6dd7cc59"
+        "0x682cb05b3efe79182019e10819d06cd3425fafd36baacb22c8956266be9b2ac2"
    }
```

```diff
    contract Universal_Adapter (eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
      sourceHashes.0:
-        "0x7ff8668a17d865513414130cf8749a6b7e7452c5ce078ffa50e1a7b74d7c333b"
+        "0x6ac887d101497a6fd8bdfbdb2a3f053e66c698ecfe7134dd3750f67a7e6f852b"
    }
```

```diff
    contract Across Multisig (eth:0xB524735356985D2f267FA010D681f061DfF03715) [GnosisSafe] {
    +++ description: None
      sourceHashes.1:
-        "0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"
+        "0x22c7fb8365a538c05d34b77dd9c1967d1ddb7427eda69f84989d4c56603312b7"
    }
```

```diff
    contract Arbitrum_Adapter (eth:0xc0b6d2f794cc787C71f2cA5ceCD57102C32379B3) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x6ca9ce1725f28d3a737cdadeddcf98fdfee47b324e779a5cdbab51cea361d883"
+        "0x0f257a2a35947505fb4b62f1d968f46a1522d7a71417215d1d1d6834fcd09149"
    }
```

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) [acrossv3/HubPool] {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      sourceHashes.0:
-        "0x3afa0a01f4cde6c678d6ec12443078407e69293b9a4519105445f694671b2dec"
+        "0xf9f15c444c97ea0bfb52d88f1424480e0c86e45cb6c889127ab1a3e6c30640f8"
    }
```

```diff
    contract Monad_Adapter (eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452) [acrossv3/universalAdapter] {
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      sourceHashes.0:
-        "0x7ff8668a17d865513414130cf8749a6b7e7452c5ce078ffa50e1a7b74d7c333b"
+        "0x6ac887d101497a6fd8bdfbdb2a3f053e66c698ecfe7134dd3750f67a7e6f852b"
    }
```

```diff
    contract IdentifierWhitelist (eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570) [uma/IdentifierWhitelist] {
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
      sourceHashes.0:
-        "0xde400b9e12dee4cf61dc66db5e9da7fb6d736020292a92092de7ae2a6bff4cac"
+        "0xa6bf0d1204bd182086e8208b83457b26507e2edb0d826bfce9e4f8c9141cafea"
    }
```

```diff
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7) [uma/AddressWhitelist] {
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
      sourceHashes.0:
-        "0x34fe953eae62cfc4797c138b47bc03a1d268dc47ac86e5fce536da6e8bc1e195"
+        "0x44a9fb7aba5f366c5709b1ea452c40bd919a9bede21b2d9f0a1fe75ad8d2eb21"
    }
```

```diff
    contract OP_Adapter (eth:0xE1f04404b74F996A311F13aE291849fC153578Ac) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0xbfd7166e5dce4fc403bfc9d03712390154e5aa737cb65ab10796605b28dc9e9e"
+        "0xd09d0d28995e5980f3ef0e5ae1c9d4b28d5d70043610e8cb52e5dd5e9b60e916"
    }
```

```diff
    contract AcrossBondToken (ABT) (eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) [acrossv3/BondToken] {
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
      sourceHashes.0:
-        "0x1d9754ae4e99e4320201bbc6f0e19aa5ecac917dcacaadba3b70cfa018910754"
+        "0x91bb8c3eff4c7412c72ecc1ec5c3d2104881a87ba7c45600a7ce280f9ae0e9f6"
    }
```

```diff
    contract SkinnyOptimisticOracle (eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24) [uma/SkinnyOptimisticOracle] {
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
      sourceHashes.0:
-        "0xbe561564083bf80216ae0f5510f70415cf97a624ef4bad88fb98a43dc4231dd6"
+        "0xb8d4c4f4e2d169995b6c707cc7b5e8e55d7d58823957a7dc788fb724302451d3"
    }
```

```diff
    contract Lisk_Adapter (eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x9c8e20215aa548a11ed98c8333dbfbaa36143263b4de43d8f73a57b19ec7cea6"
+        "0x65964e3465492ca227697477da67612af5dcb04548a7c1c36a5910c35be03bfc"
    }
```

```diff
    contract Mode_Adapter (eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x1b1b271fd3f736024fda7dd869d78943819efee5dcbf6f4075af9647cfb16cac"
+        "0xee47b40b9c392b198c1743ea54b8555ee0ef775ea685b4eb3d6d78ab6244b6a6"
    }
```

```diff
    contract Blast_Adapter (eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81) [acrossv3/Adapter] {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      sourceHashes.0:
-        "0x596bdc0b39f0ff19cde625424cdc037dd3e79355ee2c845bd8a6e5e42b3bc332"
+        "0x0bf8ebe511d302a267fa925c315521d6c6b61b8219e8e97669ea100052df4309"
    }
```

```diff
    contract OptimisticOracleV3 (eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) [uma/OptimisticOracleV3] {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      sourceHashes.0:
-        "0xfb2c9056673690384bb615fd326655f97b80fa2a5601a15a35065b0a68186ae7"
+        "0xde6962ac764b8b759d7524240877aca9d57df086f18829af492f39ffcc70622a"
    }
```

Generated with discovered.json: 0x153755d06cb57fa7d5b524932788ea54b8e83d08

# Diff at Tue, 05 May 2026 10:21:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@b6437082b3ea8fb0d97f4474b1c3452a1ce271b0 block: 1777369203
- current timestamp: 1777369203

## Description

Include deployer address

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1777369203 (main branch discovery), not current.

```diff
    contract VotingV2 (eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac) {
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Zora_Adapter (eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Soneium_Adapter (eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Universal_Adapter (eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B) {
    +++ description: This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Redstone_Adapter (eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract HubPoolStore (eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61) {
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Scroll_Adapter (eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Boba_Adapter (eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Optimism_Adapter (eth:0x3562e309C6C79626E5F0Cf746FB5Bf4f6b8EebE5) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract AcrossConfigStore (eth:0x3B03509645713718B78951126E0A6de6f10043f5) {
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Registry (eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE) {
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
      deployerAddress:
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    contract Finder (eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
      deployerAddress:
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    contract AdapterStore (eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b) {
    +++ description: A helper contract for chain adapters on the hub chain that support OFT messaging. Handles token -> messenger mapping.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Universal_Adapter (eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c) {
    +++ description: This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract ProposerV2 (eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Ethereum_Adapter (eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Polygon_Adapter (eth:0x537abE038C223066B50312474409924487D2E655) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Ink_Adapter (eth:0x545E43B6eC2f9a44CAa531298699Ff05958670B5) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Store (eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF) {
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
      deployerAddress:
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    contract Linea_Adapter (eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Ethereum_SpokePool (eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract ZkStack_CustomGasToken_Adapter (eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Universal_Adapter (eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b) {
    +++ description: This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Alephzero_Adapter (eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Base_Adapter (eth:0x799BDC55d91864b14B2eD63A34DeF5d502AA897f) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract GovernorV2 (eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract UMA Multisig (eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      deployerAddress:
+        "eth:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
    }
```

```diff
    contract OptimisticGovernor (eth:0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
      deployerAddress:
+        "eth:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
    }
```

```diff
    contract DoctorWho_Adapter (eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract WorldChain_Adapter (eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract EmergencyProposer (eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract FixedSlashSlashingLibrary (eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd) {
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Solana_Adapter (eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3) {
    +++ description: Adapter for Solana. Uses CCTP v1 AMB to relay root bundles to the Solana spokepool.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Universal_Adapter (eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db) {
    +++ description: This adapter can be used to send messages / root bundles to Tron. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract ZkStack_Adapter (eth:0xA374585E6062517Ee367ee5044946A6fBe17724f) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Universal_Adapter (eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363) {
    +++ description: This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Across Multisig (eth:0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      deployerAddress:
+        "eth:0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
    }
```

```diff
    contract Arbitrum_Adapter (eth:0xc0b6d2f794cc787C71f2cA5ceCD57102C32379B3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Monad_Adapter (eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452) {
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract IdentifierWhitelist (eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570) {
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
      deployerAddress:
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7) {
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
      deployerAddress:
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    contract OP_Adapter (eth:0xE1f04404b74F996A311F13aE291849fC153578Ac) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract AcrossBondToken (ABT) (eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) {
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract SkinnyOptimisticOracle (eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24) {
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Lisk_Adapter (eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Mode_Adapter (eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Blast_Adapter (eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract OptimisticOracleV3 (eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      deployerAddress:
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

Generated with discovered.json: 0xb9bcb28ae9a2fce7ef1f104ae48980018f1f57a8

# Diff at Tue, 28 Apr 2026 09:42:08 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@b0e388c8c86a89046e76f813630ecf1076dcf68a block: 1776070910
- current timestamp: 1777369203

## Description

edit description to add cctp use.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1776070910 (main branch discovery), not current.

```diff
    contract Solana_Adapter (eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3) {
    +++ description: Adapter for Solana. Uses CCTP v1 AMB to relay root bundles to the Solana spokepool.
      description:
-        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
+        "Adapter for Solana. Uses CCTP v1 AMB to relay root bundles to the Solana spokepool."
    }
```

Generated with discovered.json: 0x7ea035dbea964d147cd43d099123d77d04bdfe33

# Diff at Mon, 13 Apr 2026 09:14:19 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c3a2f0d255f241d65a403d105d2fa770f7305170 block: 1774353602
- current timestamp: 1776070910

## Description

add adapter for Tron.

## Watched changes

```diff
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
      values.Adapters.728126428:
+        "eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db"
      values.CrossChainContracts.728126428:
+        "eth:0x284352bb448C65b75EbE004862e4f4531042d628"
    }
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db)
    +++ description: This adapter can be used to send messages / root bundles to Tron. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

## Source code changes

```diff
...:0xA1da1A70cc9F27F4aEDff1d515B1a0C47fb6c3Db.sol | 782 +++++++++++++++++++++
 1 file changed, 782 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 1774353602 (main branch discovery), not current.

```diff
    contract Universal_Adapter (eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B) {
    +++ description: This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      description:
-        "This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero."
+        "This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
    }
```

```diff
    contract Universal_Adapter (eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c) {
    +++ description: This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
      description:
-        "This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
+        "This adapter can be used to send messages / root bundles to Tempo. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP."
    }
```

Generated with discovered.json: 0xfba62f657bf4fd24567581b1256cc9523f0cd1e3

# Diff at Tue, 24 Mar 2026 12:01:22 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@eea8d762719901a50aabccb689d291326ce8830c block: 1772441911
- current timestamp: 1774353602

## Description

7702 delegation.

## Watched changes

```diff
    EOA  (eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D) {
    +++ description: None
      proxyType:
-        "EOA"
+        "EIP7702 EOA"
      sourceHashes:
+        ["0x41c6ce964a4ef3e910f9ddf78152734dae8d1b1094ffc8334c50249a3b112bbf"]
      values:
+        {"$implementation":"eth:0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B","delegationManager":"eth:0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3","DOMAIN_VERSION":"1","eip712Domain":{"fields":"0x0f","name":"EIP7702StatelessDeleGator","version":"1","chainId":1,"verifyingContract":"eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D","salt":"0x0000000000000000000000000000000000000000000000000000000000000000","extensions":[]},"entryPoint":"eth:0x0000000071727De22E5E9d8BAf0edAc6f37da032","getDeposit":0,"getDomainHash":"0x3818b9766109877e09a9c427e7b310cde355550731129529095a7e6b02cf55ab","getNonce":0,"NAME":"EIP7702StatelessDeleGator","PACKED_USER_OP_TYPEHASH":"0xbc37962d8bd1d319c95199bdfda6d3f92baa8903a61b32d5f4ec1f4b36a3bc18","VERSION":"1.3.0"}
    }
```

Generated with discovered.json: 0x59d262f19545be70dc998bae3b0b5e32063c7574

# Diff at Mon, 02 Mar 2026 08:59:50 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1772441911

## Description

ms change.

## Initial discovery

```diff
+   Status: CREATED
    contract VotingV2 (eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac)
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
```

```diff
+   Status: CREATED
    contract Zora_Adapter (eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Soneium_Adapter (eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0x0ec70777Ac388774041dD5A1778Cdf3AF3134D2B)
    +++ description: This adapter can be used to send messages / root bundles to Hyperliquid. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
```

```diff
+   Status: CREATED
    contract Redstone_Adapter (eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract HubPoolStore (eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61)
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages.
```

```diff
+   Status: CREATED
    contract Scroll_Adapter (eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Boba_Adapter (eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (eth:0x3562e309C6C79626E5F0Cf746FB5Bf4f6b8EebE5)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract AcrossConfigStore (eth:0x3B03509645713718B78951126E0A6de6f10043f5)
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
```

```diff
+   Status: CREATED
    contract Registry (eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE)
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
```

```diff
+   Status: CREATED
    contract Finder (eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3)
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
```

```diff
+   Status: CREATED
    contract AdapterStore (eth:0x42df4D71f35ffBD28ae217d52E83C1DA0007D63b)
    +++ description: A helper contract for chain adapters on the hub chain that support OFT messaging. Handles token -> messenger mapping.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0x4577980eBFCC6fC8ff516aC06dA9e729c40cA57c)
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

```diff
+   Status: CREATED
    contract ProposerV2 (eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
```

```diff
+   Status: CREATED
    contract Ethereum_Adapter (eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (eth:0x537abE038C223066B50312474409924487D2E655)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Ink_Adapter (eth:0x545E43B6eC2f9a44CAa531298699Ff05958670B5)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Store (eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF)
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract Linea_Adapter (eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Ethereum_SpokePool (eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5)
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
```

```diff
+   Status: CREATED
    contract ZkStack_CustomGasToken_Adapter (eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0x6f1C9d3bcDF51316E7b515a62C02F601500b084b)
    +++ description: This adapter can be used to send messages / root bundles to Binance Smart Chain. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
```

```diff
+   Status: CREATED
    contract Alephzero_Adapter (eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Base_Adapter (eth:0x799BDC55d91864b14B2eD63A34DeF5d502AA897f)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract GovernorV2 (eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8)
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
```

```diff
+   Status: CREATED
    contract UMA Multisig (eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticGovernor (eth:0x8692B776d1Ff0664177c90465038056Dc64f8991)
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
```

```diff
+   Status: CREATED
    contract DoctorWho_Adapter (eth:0x8956eFa31572E1d7ed5c8e36772F214A57DFA0D1)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract WorldChain_Adapter (eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract EmergencyProposer (eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
```

```diff
+   Status: CREATED
    contract FixedSlashSlashingLibrary (eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd)
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
```

```diff
+   Status: CREATED
    contract Solana_Adapter (eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract ZkStack_Adapter (eth:0xA374585E6062517Ee367ee5044946A6fBe17724f)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (eth:0xb47fD69FE25878F4E43aAF2F9ad7D0A3A0B22363)
    +++ description: This adapter can be used to send messages / root bundles to Plasma Mainnet. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero.
```

```diff
+   Status: CREATED
    contract Across Multisig (eth:0xB524735356985D2f267FA010D681f061DfF03715)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (eth:0xc0b6d2f794cc787C71f2cA5ceCD57102C32379B3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract HubPool (eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda)
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 30m and a bond amount of 0.45 ABT.
```

```diff
+   Status: CREATED
    contract Monad_Adapter (eth:0xC29a3Ba0fBf477F16Fd53d2C438Eade024FD8452)
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain. This adapter also supports bridging OFTs via LayerZero and USDC via CCTP.
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570)
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7)
    +++ description: A simple address whitelist for tokens that can be used as bonds and/or fees. This whitelist is checked and enforced by various smart contracts in the UMA ecosystem.
```

```diff
+   Status: CREATED
    contract OP_Adapter (eth:0xE1f04404b74F996A311F13aE291849fC153578Ac)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract AcrossBondToken (ABT) (eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea)
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
```

```diff
+   Status: CREATED
    contract SkinnyOptimisticOracle (eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24)
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
```

```diff
+   Status: CREATED
    contract Lisk_Adapter (eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Mode_Adapter (eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Blast_Adapter (eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV3 (eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE)
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
```
