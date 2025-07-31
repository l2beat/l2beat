Generated with discovered.json: 0x4690026675b61dc237611add1cfd7bdfff7aa871

# Diff at Mon, 14 Jul 2025 12:44:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9f4300dad2f3d080cd56fa311d4a848556c74e72 block: 22867011
- current block number: 22867011

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22867011 (main branch discovery), not current.

```diff
    contract VotingV2 (0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac) {
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
      address:
-        "0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
+        "eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.migratedAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.previousVotingContract:
-        "0x8B1631ab830d11531aE83725fDa4D86012eCCd77"
+        "eth:0x8B1631ab830d11531aE83725fDa4D86012eCCd77"
      values.slashingLibrary:
-        "0x9a406ba5a99983250Fd663947b3c968D387ce5cd"
+        "eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd"
      values.votingToken:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      implementationNames.0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac:
-        "VotingV2"
      implementationNames.eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac:
+        "VotingV2"
    }
```

```diff
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
+        "eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_STANDARD_BRIDGE:
-        "0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
+        "eth:0x3e2Ea9B92B7E48A52296fD261dc26fd995284631"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0xdC40a14d9abd6F410226f1E6de71aE03441ca506"
+        "eth:0xdC40a14d9abd6F410226f1E6de71aE03441ca506"
      values.usdcToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x024F2fC31CBDD8de17194b1892c834f98Ef5169b:
-        "Zora_Adapter"
      implementationNames.eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b:
+        "Zora_Adapter"
    }
```

```diff
    contract Soneium_Adapter (0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
+        "eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_OP_USDC_BRIDGE:
-        "0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb"
+        "eth:0xC67A8c5f22b40274Ca7C4A56Db89569Ee2AD3FAb"
      values.L1_STANDARD_BRIDGE:
-        "0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
+        "eth:0xeb9bf100225c214Efc3E7C651ebbaDcF85177607"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
+        "eth:0x9CF951E3F74B644e621b36Ca9cea147a78D4c39f"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2:
-        "OP_Adapter"
      implementationNames.eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2:
+        "OP_Adapter"
    }
```

```diff
    contract Arbitrum_Adapter (0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210"
+        "eth:0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210"
      values.cctpTokenMessenger:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.L1_DAI:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.L1_ERC20_GATEWAY_ROUTER:
-        "0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
+        "eth:0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef"
      values.L1_INBOX:
-        "0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
+        "eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f"
      values.L2_REFUND_L2_ADDRESS:
-        "0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
+        "eth:0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210:
-        "Arbitrum_Adapter"
      implementationNames.eth:0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210:
+        "Arbitrum_Adapter"
    }
```

```diff
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
+        "eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_STANDARD_BRIDGE:
-        "0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
+        "eth:0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
+        "eth:0x592C1299e0F8331D81A28C0FC7352Da24eDB444a"
      values.usdcToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x188F8C95B7cfB7993B53a4F643efa687916f73fA:
-        "Redstone_Adapter"
      implementationNames.eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA:
+        "Redstone_Adapter"
    }
```

```diff
    contract HubPoolStore (0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61) {
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages.
      address:
-        "0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61"
+        "eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61"
      values.hubPool:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      implementationNames.0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61:
-        "HubPoolStore"
      implementationNames.eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61:
+        "HubPoolStore"
    }
```

```diff
    EOA  (0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05) {
    +++ description: None
      address:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "eth:0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
    }
```

```diff
    contract Universal_Adapter (0x22001f37B586792F25Ef9d19d99537C6446e0833) {
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain.
      address:
-        "0x22001f37B586792F25Ef9d19d99537C6446e0833"
+        "eth:0x22001f37B586792F25Ef9d19d99537C6446e0833"
      description:
-        "This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the 0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain."
+        "This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain."
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.DATA_STORE:
-        "0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61"
+        "eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x22001f37B586792F25Ef9d19d99537C6446e0833:
-        "Universal_Adapter"
      implementationNames.eth:0x22001f37B586792F25Ef9d19d99537C6446e0833:
+        "Universal_Adapter"
    }
```

```diff
    EOA  (0x2bAaA41d155ad8a4126184950B31F50A1513cE25) {
    +++ description: None
      address:
-        "0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
    }
```

```diff
    contract Scroll_Adapter (0x2DA799c2223c6ffB595e578903AE6b95839160d8) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x2DA799c2223c6ffB595e578903AE6b95839160d8"
+        "eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8"
      values.L1_GATEWAY_ROUTER:
-        "0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
+        "eth:0xF8B1378579659D8F7EE5f3C929c2f3E332E41Fd6"
      values.L1_SCROLL_MESSENGER:
-        "0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
+        "eth:0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367"
      values.L2_GAS_PRICE_ORACLE:
-        "0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
+        "eth:0x56971da63A3C0205184FEF096E9ddFc7A8C2D18a"
      implementationNames.0x2DA799c2223c6ffB595e578903AE6b95839160d8:
-        "Scroll_Adapter"
      implementationNames.eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8:
+        "Scroll_Adapter"
    }
```

```diff
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3"
+        "eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3"
      values.l1StandardBridge:
-        "0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
+        "eth:0xdc1664458d2f0B6090bEa60A8793A4E66c2F1c00"
      values.l1Weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.messenger:
-        "0x6D4528d192dB72E282265D6092F4B872f9Dff69e"
+        "eth:0x6D4528d192dB72E282265D6092F4B872f9Dff69e"
      implementationNames.0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3:
-        "Boba_Adapter"
      implementationNames.eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3:
+        "Boba_Adapter"
    }
```

```diff
    EOA  (0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5) {
    +++ description: None
      address:
-        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
+        "eth:0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
    }
```

```diff
    contract AcrossConfigStore (0x3B03509645713718B78951126E0A6de6f10043f5) {
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
      address:
-        "0x3B03509645713718B78951126E0A6de6f10043f5"
+        "eth:0x3B03509645713718B78951126E0A6de6f10043f5"
      values.owner:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      implementationNames.0x3B03509645713718B78951126E0A6de6f10043f5:
-        "AcrossConfigStore"
      implementationNames.eth:0x3B03509645713718B78951126E0A6de6f10043f5:
+        "AcrossConfigStore"
    }
```

```diff
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE) {
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
      address:
-        "0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
+        "eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
      values.getAllRegisteredContracts.0:
-        "0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc"
+        "eth:0x592349F7DeDB2b75f9d4F194d4b7C16D82E507Dc"
      values.getAllRegisteredContracts.1:
-        "0x3f2D9eDd9702909Cf1F8C4237B7c4c5931F9C944"
+        "eth:0x3f2D9eDd9702909Cf1F8C4237B7c4c5931F9C944"
      values.getAllRegisteredContracts.2:
-        "0x67DD35EaD67FcD184C8Ff6D0251DF4241F309ce1"
+        "eth:0x67DD35EaD67FcD184C8Ff6D0251DF4241F309ce1"
      values.getAllRegisteredContracts.3:
-        "0x39450EB4f7DE57f2a25EeE548Ff392532cFB8759"
+        "eth:0x39450EB4f7DE57f2a25EeE548Ff392532cFB8759"
      values.getAllRegisteredContracts.4:
-        "0xb56C5f1fB93b1Fbd7c473926c87B6B9c4d0e21d5"
+        "eth:0xb56C5f1fB93b1Fbd7c473926c87B6B9c4d0e21d5"
      values.getAllRegisteredContracts.5:
-        "0x4E3168Ea1082f3dda1694646B5EACdeb572009F1"
+        "eth:0x4E3168Ea1082f3dda1694646B5EACdeb572009F1"
      values.getAllRegisteredContracts.6:
-        "0xE1Ee8D4C5dBA1c221840c08f6Cf42154435B9D52"
+        "eth:0xE1Ee8D4C5dBA1c221840c08f6Cf42154435B9D52"
      values.getAllRegisteredContracts.7:
-        "0xc0b19570370478EDE5F2e922c5D31FAf1D5f90EA"
+        "eth:0xc0b19570370478EDE5F2e922c5D31FAf1D5f90EA"
      values.getAllRegisteredContracts.8:
-        "0xaBBee9fC7a882499162323EEB7BF6614193312e3"
+        "eth:0xaBBee9fC7a882499162323EEB7BF6614193312e3"
      values.getAllRegisteredContracts.9:
-        "0x3605Ec11BA7bD208501cbb24cd890bC58D2dbA56"
+        "eth:0x3605Ec11BA7bD208501cbb24cd890bC58D2dbA56"
      values.getAllRegisteredContracts.10:
-        "0x306B19502c833C1522Fbc36C9dd7531Eda35862B"
+        "eth:0x306B19502c833C1522Fbc36C9dd7531Eda35862B"
      values.getAllRegisteredContracts.11:
-        "0x1477C532A5054e0879EaFBD6004208c2065Bc21f"
+        "eth:0x1477C532A5054e0879EaFBD6004208c2065Bc21f"
      values.getAllRegisteredContracts.12:
-        "0x3a93E863cb3adc5910E6cea4d51f132E8666654F"
+        "eth:0x3a93E863cb3adc5910E6cea4d51f132E8666654F"
      values.getAllRegisteredContracts.13:
-        "0x516f595978D87B67401DaB7AfD8555c3d28a3Af4"
+        "eth:0x516f595978D87B67401DaB7AfD8555c3d28a3Af4"
      values.getAllRegisteredContracts.14:
-        "0xeFA41F506EAA5c24666d4eE40888bA18FA60a1c7"
+        "eth:0xeFA41F506EAA5c24666d4eE40888bA18FA60a1c7"
      values.getAllRegisteredContracts.15:
-        "0xC843538d70ee5d28C5A80A75bb94C28925bB1cf2"
+        "eth:0xC843538d70ee5d28C5A80A75bb94C28925bB1cf2"
      values.getAllRegisteredContracts.16:
-        "0xf32219331A03D99C98Adf96D43cc312353003531"
+        "eth:0xf32219331A03D99C98Adf96D43cc312353003531"
      values.getAllRegisteredContracts.17:
-        "0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2"
+        "eth:0x4AA79c00240a2094Ff3fa6CF7c67f521f32D84a2"
      values.getAllRegisteredContracts.18:
-        "0xECFE06574B4A23A6476AD1f2568166BD1857E7c5"
+        "eth:0xECFE06574B4A23A6476AD1f2568166BD1857E7c5"
      values.getAllRegisteredContracts.19:
-        "0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5"
+        "eth:0xE4256C47a3b27a969F25de8BEf44eCA5F2552bD5"
      values.getAllRegisteredContracts.20:
-        "0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8"
+        "eth:0x1c3f1A342c8D9591D9759220d114C685FD1cF6b8"
      values.getAllRegisteredContracts.21:
-        "0xEAA081a9fad4607CdF046fEA7D4BF3DfEf533282"
+        "eth:0xEAA081a9fad4607CdF046fEA7D4BF3DfEf533282"
      values.getAllRegisteredContracts.22:
-        "0x2E918f0F18A69CFda3333C146A81e8100C85D8B0"
+        "eth:0x2E918f0F18A69CFda3333C146A81e8100C85D8B0"
      values.getAllRegisteredContracts.23:
-        "0xfA3AA7EE08399A4cE0B4921c85AB7D645Ccac669"
+        "eth:0xfA3AA7EE08399A4cE0B4921c85AB7D645Ccac669"
      values.getAllRegisteredContracts.24:
-        "0xCA44D9e1eB0b27A0B56CdbebF4198DE5C2e6F7D0"
+        "eth:0xCA44D9e1eB0b27A0B56CdbebF4198DE5C2e6F7D0"
      values.getAllRegisteredContracts.25:
-        "0xa1005DB6516A097E562ad7506CF90ebb511f5604"
+        "eth:0xa1005DB6516A097E562ad7506CF90ebb511f5604"
      values.getAllRegisteredContracts.26:
-        "0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495"
+        "eth:0x45c4DBD73294c5d8DDF6E5F949BE4C505E6E9495"
      values.getAllRegisteredContracts.27:
-        "0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d"
+        "eth:0xd6fc1A7327210b7Fe33Ef2514B44979719424A1d"
      values.getAllRegisteredContracts.28:
-        "0xda0943251079eB9f517668fdB372fC6AE299D898"
+        "eth:0xda0943251079eB9f517668fdB372fC6AE299D898"
      values.getAllRegisteredContracts.29:
-        "0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037"
+        "eth:0xf215778F3a5e7Ab6A832e71d87267Dd9a9aB0037"
      values.getAllRegisteredContracts.30:
-        "0xeAddB6AD65dcA45aC3bB32f88324897270DA0387"
+        "eth:0xeAddB6AD65dcA45aC3bB32f88324897270DA0387"
      values.getAllRegisteredContracts.31:
-        "0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195"
+        "eth:0x267D46e71764ABaa5a0dD45260f95D9c8d5b8195"
      values.getAllRegisteredContracts.32:
-        "0xd81028a6fbAAaf604316F330b20D24bFbFd14478"
+        "eth:0xd81028a6fbAAaf604316F330b20D24bFbFd14478"
      values.getAllRegisteredContracts.33:
-        "0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585"
+        "eth:0x2862A798B3DeFc1C24b9c0d241BEaF044C45E585"
      values.getAllRegisteredContracts.34:
-        "0x94C7cab26c04B76D9Ab6277a0960781b90f74294"
+        "eth:0x94C7cab26c04B76D9Ab6277a0960781b90f74294"
      values.getAllRegisteredContracts.35:
-        "0x7c4090170aeADD54B1a0DbAC2C8D08719220A435"
+        "eth:0x7c4090170aeADD54B1a0DbAC2C8D08719220A435"
      values.getAllRegisteredContracts.36:
-        "0xaD3cceebeFfCdC3576dE56811d0A6D164BF9A5A1"
+        "eth:0xaD3cceebeFfCdC3576dE56811d0A6D164BF9A5A1"
      values.getAllRegisteredContracts.37:
-        "0xaB3Aa2768Ba6c5876B2552a6F9b70E54aa256175"
+        "eth:0xaB3Aa2768Ba6c5876B2552a6F9b70E54aa256175"
      values.getAllRegisteredContracts.38:
-        "0x48546bDD57D34Cb110f011Cdd1CcaaE75Ee17a70"
+        "eth:0x48546bDD57D34Cb110f011Cdd1CcaaE75Ee17a70"
      values.getAllRegisteredContracts.39:
-        "0x182d5993106573A95a182AB3A77c892713fFDA56"
+        "eth:0x182d5993106573A95a182AB3A77c892713fFDA56"
      values.getAllRegisteredContracts.40:
-        "0xD50fbace72352C2e15E0986b8Ad2599627B5c340"
+        "eth:0xD50fbace72352C2e15E0986b8Ad2599627B5c340"
      values.getAllRegisteredContracts.41:
-        "0x14a046c066266da6b8b8C4D2de4AfBEeCd53a262"
+        "eth:0x14a046c066266da6b8b8C4D2de4AfBEeCd53a262"
      values.getAllRegisteredContracts.42:
-        "0x496B179D5821d1a8B6C875677e3B89a9229AAB77"
+        "eth:0x496B179D5821d1a8B6C875677e3B89a9229AAB77"
      values.getAllRegisteredContracts.43:
-        "0x287a1bA52e030459F163f48b2Ae468a085003A07"
+        "eth:0x287a1bA52e030459F163f48b2Ae468a085003A07"
      values.getAllRegisteredContracts.44:
-        "0x5A7f8F8B0E912BBF8525bc3fb2ae46E70Db9516B"
+        "eth:0x5A7f8F8B0E912BBF8525bc3fb2ae46E70Db9516B"
      values.getAllRegisteredContracts.45:
-        "0x4F1424Cef6AcE40c0ae4fc64d74B734f1eAF153C"
+        "eth:0x4F1424Cef6AcE40c0ae4fc64d74B734f1eAF153C"
      values.getAllRegisteredContracts.46:
-        "0xb33E3b8f5a172776730B0945206D6f75a2491307"
+        "eth:0xb33E3b8f5a172776730B0945206D6f75a2491307"
      values.getAllRegisteredContracts.47:
-        "0x4E2697b3deEc9Cac270Be97e254EC1a791588770"
+        "eth:0x4E2697b3deEc9Cac270Be97e254EC1a791588770"
      values.getAllRegisteredContracts.48:
-        "0xCdf99b9acE35e6414d802E97ed75ecfEe99A6f62"
+        "eth:0xCdf99b9acE35e6414d802E97ed75ecfEe99A6f62"
      values.getAllRegisteredContracts.49:
-        "0xF796059731942aB6317E1bD5a8E98eF1f6D345b1"
+        "eth:0xF796059731942aB6317E1bD5a8E98eF1f6D345b1"
      values.getAllRegisteredContracts.50:
-        "0xdf739f0219fA1A9288fc4c790304c8a3E928544C"
+        "eth:0xdf739f0219fA1A9288fc4c790304c8a3E928544C"
      values.getAllRegisteredContracts.51:
-        "0x9E929a85282fB0555C19Ed70942B952827Ca4B0B"
+        "eth:0x9E929a85282fB0555C19Ed70942B952827Ca4B0B"
      values.getAllRegisteredContracts.52:
-        "0x384e239a2B225865558774b005C3d6eC29f8cE70"
+        "eth:0x384e239a2B225865558774b005C3d6eC29f8cE70"
      values.getAllRegisteredContracts.53:
-        "0x4E8d60A785c2636A63c5Bd47C7050d21266c8B43"
+        "eth:0x4E8d60A785c2636A63c5Bd47C7050d21266c8B43"
      values.getAllRegisteredContracts.54:
-        "0x6618Ff5a7dcea49F1AADA3BaFde3e87fe28D1303"
+        "eth:0x6618Ff5a7dcea49F1AADA3BaFde3e87fe28D1303"
      values.getAllRegisteredContracts.55:
-        "0x964Be01cCe200e168c4ba960a764cBEBa8C01200"
+        "eth:0x964Be01cCe200e168c4ba960a764cBEBa8C01200"
      values.getAllRegisteredContracts.56:
-        "0x9bB1f39b6DB45BD087046385a43EAb7b60C52e7D"
+        "eth:0x9bB1f39b6DB45BD087046385a43EAb7b60C52e7D"
      values.getAllRegisteredContracts.57:
-        "0x0388f65C185a7E7D857BB142185381d97a4bc747"
+        "eth:0x0388f65C185a7E7D857BB142185381d97a4bc747"
      values.getAllRegisteredContracts.58:
-        "0x161fa1ac2D93832C3F77c8b5879Cb4dC56d958a7"
+        "eth:0x161fa1ac2D93832C3F77c8b5879Cb4dC56d958a7"
      values.getAllRegisteredContracts.59:
-        "0x14A415Dd90B63c791C5dc544594605c8bC13Bc8D"
+        "eth:0x14A415Dd90B63c791C5dc544594605c8bC13Bc8D"
      values.getAllRegisteredContracts.60:
-        "0x1066E9D2E372d01A0F57bB6f231D34Ce4CEd228e"
+        "eth:0x1066E9D2E372d01A0F57bB6f231D34Ce4CEd228e"
      values.getAllRegisteredContracts.61:
-        "0xa24Ba528Be99024f7F7C227b55cBb265ecf0C078"
+        "eth:0xa24Ba528Be99024f7F7C227b55cBb265ecf0C078"
      values.getAllRegisteredContracts.62:
-        "0xd60139B287De1408f8388f5f57fC114Fb4B03328"
+        "eth:0xd60139B287De1408f8388f5f57fC114Fb4B03328"
      values.getAllRegisteredContracts.63:
-        "0x8E51Ad4EeB19693751a9A3E36b8F098D891Ddc7f"
+        "eth:0x8E51Ad4EeB19693751a9A3E36b8F098D891Ddc7f"
      values.getAllRegisteredContracts.64:
-        "0x144A3290C9Db859939F085E3EC9A5C321FC713aF"
+        "eth:0x144A3290C9Db859939F085E3EC9A5C321FC713aF"
      values.getAllRegisteredContracts.65:
-        "0xDB2E7F6655de37822c3020a8988351CC76caDAD5"
+        "eth:0xDB2E7F6655de37822c3020a8988351CC76caDAD5"
      values.getAllRegisteredContracts.66:
-        "0x6DA66C15823cFf681DaD6963fBD325a520362958"
+        "eth:0x6DA66C15823cFf681DaD6963fBD325a520362958"
      values.getAllRegisteredContracts.67:
-        "0xb82756f9853A148A2390a08AaD30BabCDc22f068"
+        "eth:0xb82756f9853A148A2390a08AaD30BabCDc22f068"
      values.getAllRegisteredContracts.68:
-        "0xdF68acF496Db55f4A882a0371c489D739173fbEc"
+        "eth:0xdF68acF496Db55f4A882a0371c489D739173fbEc"
      values.getAllRegisteredContracts.69:
-        "0x02bD62088A02668F29102B06E4925791Cd0fe4C5"
+        "eth:0x02bD62088A02668F29102B06E4925791Cd0fe4C5"
      values.getAllRegisteredContracts.70:
-        "0x45788a369f3083c02b942aEa02DBa25C466a773F"
+        "eth:0x45788a369f3083c02b942aEa02DBa25C466a773F"
      values.getAllRegisteredContracts.71:
-        "0x52f83ACA94904b3590669E3525d25ec75cDFf798"
+        "eth:0x52f83ACA94904b3590669E3525d25ec75cDFf798"
      values.getAllRegisteredContracts.72:
-        "0xfDF90C4104c1dE34979235e6AE080528266a14a3"
+        "eth:0xfDF90C4104c1dE34979235e6AE080528266a14a3"
      values.getAllRegisteredContracts.73:
-        "0xb40BA94747c59d076B3c189E3A031547492013da"
+        "eth:0xb40BA94747c59d076B3c189E3A031547492013da"
      values.getAllRegisteredContracts.74:
-        "0x46f5E363e69798a74c8422BFb9EDB63e3FB0f08a"
+        "eth:0x46f5E363e69798a74c8422BFb9EDB63e3FB0f08a"
      values.getAllRegisteredContracts.75:
-        "0x8F92465991e1111F012F24A55AE2B0742F82dd7b"
+        "eth:0x8F92465991e1111F012F24A55AE2B0742F82dd7b"
      values.getAllRegisteredContracts.76:
-        "0x885c5fCB4D3B574A39f6750F962a3b52600ad728"
+        "eth:0x885c5fCB4D3B574A39f6750F962a3b52600ad728"
      values.getAllRegisteredContracts.77:
-        "0xd9af2d7E4cF86aAfBCf688a47Bd6b95Da9F7c838"
+        "eth:0xd9af2d7E4cF86aAfBCf688a47Bd6b95Da9F7c838"
      values.getAllRegisteredContracts.78:
-        "0x0f4e2a456aAfc0068a0718E3107B88d2e8f2bfEF"
+        "eth:0x0f4e2a456aAfc0068a0718E3107B88d2e8f2bfEF"
      values.getAllRegisteredContracts.79:
-        "0x312Ecf2854f73a3Ff616e3CDBC05E2Ff6A98d1f0"
+        "eth:0x312Ecf2854f73a3Ff616e3CDBC05E2Ff6A98d1f0"
      values.getAllRegisteredContracts.80:
-        "0x0Ee5Bb3dEAe8a44FbDeB269941f735793F8312Ef"
+        "eth:0x0Ee5Bb3dEAe8a44FbDeB269941f735793F8312Ef"
      values.getAllRegisteredContracts.81:
-        "0xCef85b352CCD7a446d94AEeeA02dD11622289954"
+        "eth:0xCef85b352CCD7a446d94AEeeA02dD11622289954"
      values.getAllRegisteredContracts.82:
-        "0x56BaBEcb3dCaC063697fE38AB745c10181c56fA6"
+        "eth:0x56BaBEcb3dCaC063697fE38AB745c10181c56fA6"
      values.getAllRegisteredContracts.83:
-        "0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4"
+        "eth:0x4F8d7bFFe8a2428A313b737001311Ad302a60dF4"
      values.getAllRegisteredContracts.84:
-        "0x10E018C01792705BefB7A757628C2947E38B9426"
+        "eth:0x10E018C01792705BefB7A757628C2947E38B9426"
      values.getAllRegisteredContracts.85:
-        "0xb2AEa0DE92Acff7e1146333F776db42E5d004128"
+        "eth:0xb2AEa0DE92Acff7e1146333F776db42E5d004128"
      values.getAllRegisteredContracts.86:
-        "0x0D1bA751BaDe6d7BB54CF4F05D2dC0A9f45605e5"
+        "eth:0x0D1bA751BaDe6d7BB54CF4F05D2dC0A9f45605e5"
      values.getAllRegisteredContracts.87:
-        "0x0759883acF042A54fAb083378b0395F773A79767"
+        "eth:0x0759883acF042A54fAb083378b0395F773A79767"
      values.getAllRegisteredContracts.88:
-        "0x32F0405834C4b50be53199628C45603Cea3A28aA"
+        "eth:0x32F0405834C4b50be53199628C45603Cea3A28aA"
      values.getAllRegisteredContracts.89:
-        "0xC9E6C106C65eDD67C83CC6e3bCd18bf8d2Ebf182"
+        "eth:0xC9E6C106C65eDD67C83CC6e3bCd18bf8d2Ebf182"
      values.getAllRegisteredContracts.90:
-        "0x9c9Ee67586FaF80aFE147306FB858AF4Ec2212a4"
+        "eth:0x9c9Ee67586FaF80aFE147306FB858AF4Ec2212a4"
      values.getAllRegisteredContracts.91:
-        "0x12d21cb3E544de60Edb434A43ae7ef0715bee6cc"
+        "eth:0x12d21cb3E544de60Edb434A43ae7ef0715bee6cc"
      values.getAllRegisteredContracts.92:
-        "0xeCFe987D8C103a3EC2041774E4514ED0614fB42C"
+        "eth:0xeCFe987D8C103a3EC2041774E4514ED0614fB42C"
      values.getAllRegisteredContracts.93:
-        "0x67F4deC415Ce95F8e66d63C926605d16f8d1b4e4"
+        "eth:0x67F4deC415Ce95F8e66d63C926605d16f8d1b4e4"
      values.getAllRegisteredContracts.94:
-        "0x7FBE19088B011A9dE0e3a327D7C681028F065616"
+        "eth:0x7FBE19088B011A9dE0e3a327D7C681028F065616"
      values.getAllRegisteredContracts.95:
-        "0xB1a3E5a8d642534840bFC50c6417F9566E716cc7"
+        "eth:0xB1a3E5a8d642534840bFC50c6417F9566E716cc7"
      values.getAllRegisteredContracts.96:
-        "0xC73a3831B4A91Ab05f9171c0ef0BEc9545cDeCf5"
+        "eth:0xC73a3831B4A91Ab05f9171c0ef0BEc9545cDeCf5"
      values.getAllRegisteredContracts.97:
-        "0xbc044745F137D4693c2Aa823C760f855254faD42"
+        "eth:0xbc044745F137D4693c2Aa823C760f855254faD42"
      values.getAllRegisteredContracts.98:
-        "0xF8eF02C10C473CA5E48b10c62ba4d46115dd2288"
+        "eth:0xF8eF02C10C473CA5E48b10c62ba4d46115dd2288"
      values.getAllRegisteredContracts.99:
-        "0x6F4DD6F2dD3aCb85e4903c3307e18A35D59537c0"
+        "eth:0x6F4DD6F2dD3aCb85e4903c3307e18A35D59537c0"
      values.getAllRegisteredContracts.100:
-        "0x5917C41a355D16D3950FE12299Ce6DFc1b54cD54"
+        "eth:0x5917C41a355D16D3950FE12299Ce6DFc1b54cD54"
      values.getAllRegisteredContracts.101:
-        "0x5fbD22d64A1bD27b77e0f9d6e8831510439e947A"
+        "eth:0x5fbD22d64A1bD27b77e0f9d6e8831510439e947A"
      values.getAllRegisteredContracts.102:
-        "0xe79dd3BDfb7868DedD00108FecaF12F94eB113B8"
+        "eth:0xe79dd3BDfb7868DedD00108FecaF12F94eB113B8"
      values.getAllRegisteredContracts.103:
-        "0xa1Da681EA4b03ab826D33B7a9774222Ae175322F"
+        "eth:0xa1Da681EA4b03ab826D33B7a9774222Ae175322F"
      values.getAllRegisteredContracts.104:
-        "0x77482A8488a1cA8EdFAc67277b0eB99591106f05"
+        "eth:0x77482A8488a1cA8EdFAc67277b0eB99591106f05"
      values.getAllRegisteredContracts.105:
-        "0x73220345bD37C6897dA959AE6205254be5da4dD8"
+        "eth:0x73220345bD37C6897dA959AE6205254be5da4dD8"
      values.getAllRegisteredContracts.106:
-        "0xdd0acE85FcdC46d6430C7F24d56A0A80277AD8D2"
+        "eth:0xdd0acE85FcdC46d6430C7F24d56A0A80277AD8D2"
      values.getAllRegisteredContracts.107:
-        "0x7bc1476eeD521c083Ec84D2894a7B7f738c93b3b"
+        "eth:0x7bc1476eeD521c083Ec84D2894a7B7f738c93b3b"
      values.getAllRegisteredContracts.108:
-        "0xCbbA8c0645ffb8aA6ec868f6F5858F2b0eAe34DA"
+        "eth:0xCbbA8c0645ffb8aA6ec868f6F5858F2b0eAe34DA"
      values.getAllRegisteredContracts.109:
-        "0xeF4Db4AF6189aae295a680345e07E00d25ECBAAb"
+        "eth:0xeF4Db4AF6189aae295a680345e07E00d25ECBAAb"
      values.getAllRegisteredContracts.110:
-        "0x10D00f5788C39a2Bf248ADfa2863Fa55d83dcE36"
+        "eth:0x10D00f5788C39a2Bf248ADfa2863Fa55d83dcE36"
      values.getAllRegisteredContracts.111:
-        "0x8484381906425E3AFe30CDD48bFc4ed7CC1499D4"
+        "eth:0x8484381906425E3AFe30CDD48bFc4ed7CC1499D4"
      values.getAllRegisteredContracts.112:
-        "0xeE44aE0cff6E9E62F26add74784E573bD671F144"
+        "eth:0xeE44aE0cff6E9E62F26add74784E573bD671F144"
      values.getAllRegisteredContracts.113:
-        "0xee7f8088d2e67C5b10EB94732F4bB6E26968AC82"
+        "eth:0xee7f8088d2e67C5b10EB94732F4bB6E26968AC82"
      values.getAllRegisteredContracts.114:
-        "0xb9942AA8983d41e53b68209BeA596A6004321E77"
+        "eth:0xb9942AA8983d41e53b68209BeA596A6004321E77"
      values.getAllRegisteredContracts.115:
-        "0x52B21a720D5eBeFc7EFA802c7DEAB7c08Eb10F39"
+        "eth:0x52B21a720D5eBeFc7EFA802c7DEAB7c08Eb10F39"
      values.getAllRegisteredContracts.116:
-        "0x772665dce7b347A867F42bcA93587b5400Ae2576"
+        "eth:0x772665dce7b347A867F42bcA93587b5400Ae2576"
      values.getAllRegisteredContracts.117:
-        "0x2dE7A5157693a895ae8E55b1e935e23451a77cB3"
+        "eth:0x2dE7A5157693a895ae8E55b1e935e23451a77cB3"
      values.getAllRegisteredContracts.118:
-        "0xcA9C3d3fA9419C49465e04C49dD38C054fD94712"
+        "eth:0xcA9C3d3fA9419C49465e04C49dD38C054fD94712"
      values.getAllRegisteredContracts.119:
-        "0xc07dE54Aa905A644Ab67F6E3b0d40150Bf825Ca3"
+        "eth:0xc07dE54Aa905A644Ab67F6E3b0d40150Bf825Ca3"
      values.getAllRegisteredContracts.120:
-        "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"
+        "eth:0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c"
      values.getAllRegisteredContracts.121:
-        "0xbD1463F02f61676d53fd183C2B19282BFF93D099"
+        "eth:0xbD1463F02f61676d53fd183C2B19282BFF93D099"
      values.getAllRegisteredContracts.122:
-        "0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c"
+        "eth:0x767058F11800FBA6A682E73A6e79ec5eB74Fac8c"
      values.getAllRegisteredContracts.123:
-        "0x799c9518Ea434bBdA03d4C0EAa58d644b768d3aB"
+        "eth:0x799c9518Ea434bBdA03d4C0EAa58d644b768d3aB"
      values.getAllRegisteredContracts.124:
-        "0x1C7a921808a8054C7ac2a3A3112823803eC97Ce4"
+        "eth:0x1C7a921808a8054C7ac2a3A3112823803eC97Ce4"
      values.getAllRegisteredContracts.125:
-        "0x60E5db98d156B68bC079795096D8599d12F2DcA6"
+        "eth:0x60E5db98d156B68bC079795096D8599d12F2DcA6"
      values.getAllRegisteredContracts.126:
-        "0x91436EB8038ecc12c60EE79Dfe011EdBe0e6C777"
+        "eth:0x91436EB8038ecc12c60EE79Dfe011EdBe0e6C777"
      values.getAllRegisteredContracts.127:
-        "0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
+        "eth:0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
      values.getAllRegisteredContracts.128:
-        "0xe7B0D6A9943bB8CD8cd323368450AD74474bB1b7"
+        "eth:0xe7B0D6A9943bB8CD8cd323368450AD74474bB1b7"
      values.getAllRegisteredContracts.129:
-        "0xcA2531b9CD04daf0c9114D853e7A83D8528f20bD"
+        "eth:0xcA2531b9CD04daf0c9114D853e7A83D8528f20bD"
      values.getAllRegisteredContracts.130:
-        "0x7C62e5c39b7b296f4f2244e7EB51bea57ed26e4B"
+        "eth:0x7C62e5c39b7b296f4f2244e7EB51bea57ed26e4B"
      values.getAllRegisteredContracts.131:
-        "0xf35a80E4705C56Fd345E735387c3377baCcd8189"
+        "eth:0xf35a80E4705C56Fd345E735387c3377baCcd8189"
      values.getAllRegisteredContracts.132:
-        "0x4060dBA72344DA74EDaEEAe51a71a57F7E96b6b4"
+        "eth:0x4060dBA72344DA74EDaEEAe51a71a57F7E96b6b4"
      values.getAllRegisteredContracts.133:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.getAllRegisteredContracts.134:
-        "0x8fE658AeB8d55fd1F3E157Ff8B316E232ffFF372"
+        "eth:0x8fE658AeB8d55fd1F3E157Ff8B316E232ffFF372"
      values.getAllRegisteredContracts.135:
-        "0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5"
+        "eth:0x226726Ac52e6e948D1B7eA9168F9Ff2E27DbcbB5"
      values.getAllRegisteredContracts.136:
-        "0x34dF79AB1F3Cb70445834e71D725f83A6d3e03eb"
+        "eth:0x34dF79AB1F3Cb70445834e71D725f83A6d3e03eb"
      values.getAllRegisteredContracts.137:
-        "0xbCA5D4BF2bE2f18a964334A378219CAaB192F0BF"
+        "eth:0xbCA5D4BF2bE2f18a964334A378219CAaB192F0BF"
      values.getAllRegisteredContracts.138:
-        "0x89477Dd602f69c59Eb6B8e5C059F041a32ae4017"
+        "eth:0x89477Dd602f69c59Eb6B8e5C059F041a32ae4017"
      values.getAllRegisteredContracts.139:
-        "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
+        "eth:0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
      values.getAllRegisteredContracts.140:
-        "0xC75dd1b2A04d5aFF1E2779Ccc5624174a2c8cb7f"
+        "eth:0xC75dd1b2A04d5aFF1E2779Ccc5624174a2c8cb7f"
      values.getAllRegisteredContracts.141:
-        "0x86838871562B82C071ec57F7CA50879532678F42"
+        "eth:0x86838871562B82C071ec57F7CA50879532678F42"
      values.getAllRegisteredContracts.142:
-        "0xFEc7C6AA64fDD17f456028e0B411f5c3877ADa5e"
+        "eth:0xFEc7C6AA64fDD17f456028e0B411f5c3877ADa5e"
      values.getAllRegisteredContracts.143:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.getAllRegisteredContracts.144:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.getAllRegisteredContracts.145:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getAllRegisteredContracts.146:
-        "0x9B40E25dDd4518F36c50ce8AEf53Ee527419D55d"
+        "eth:0x9B40E25dDd4518F36c50ce8AEf53Ee527419D55d"
      values.getMember.0:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0x3e532e6222afe9Bcf02DCB87216802c75D5113aE:
-        "Registry"
      implementationNames.eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE:
+        "Registry"
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
      address:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.namedAddresses.0.address:
-        "0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
+        "eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
      values.namedAddresses.1.address:
-        "0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
+        "eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
      values.namedAddresses.2.address:
-        "0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A"
+        "eth:0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A"
      values.namedAddresses.3.address:
-        "0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
      values.namedAddresses.4.address:
-        "0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
+        "eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
      values.namedAddresses.5.address:
-        "0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
+        "eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
      values.namedAddresses.6.address:
-        "0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
+        "eth:0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"
      values.namedAddresses.7.address:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.namedAddresses.8.address:
-        "0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
+        "eth:0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"
      values.namedAddresses.9.address:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.namedAddresses.10.address:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0x40f941E48A552bF496B154Af6bf55725f18D77c3:
-        "Finder"
      implementationNames.eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3:
+        "Finder"
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      address:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.governor:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.token:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      implementationNames.0x50efaC9619225d7fB4703C5872da978849B6E7cC:
-        "ProposerV2"
      implementationNames.eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC:
+        "ProposerV2"
    }
```

```diff
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x527E872a5c3f0C7c24Fe33F2593cFB890a285084"
+        "eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084"
      implementationNames.0x527E872a5c3f0C7c24Fe33F2593cFB890a285084:
-        "Ethereum_Adapter"
      implementationNames.eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084:
+        "Ethereum_Adapter"
    }
```

```diff
    contract Store (0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF) {
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
      address:
-        "0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
      values.getMember.0:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getMember.1:
-        "0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.timerAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.withdrawer:
-        "0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
+        "eth:0x2bAaA41d155ad8a4126184950B31F50A1513cE25"
      implementationNames.0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF:
-        "Store"
      implementationNames.eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF:
+        "Store"
    }
```

```diff
    contract Linea_Adapter (0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
+        "eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
      values.cctpTokenMessenger:
-        "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
+        "eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
      values.L1_MESSAGE_SERVICE:
-        "0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
+        "eth:0xd19d4B5d358258f05D7B411E21A1460D11B0876F"
      values.L1_TOKEN_BRIDGE:
-        "0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
+        "eth:0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787:
-        "Linea_Adapter"
      implementationNames.eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787:
+        "Linea_Adapter"
    }
```

```diff
    EOA  (0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a) {
    +++ description: None
      address:
-        "0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
+        "eth:0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
    }
```

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
      address:
-        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.$admin:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      values.$implementation:
-        "0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80"
+        "eth:0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80"
      values.$pastUpgrades.0.2.0:
-        "0xA667498F46457548f1D3ad557340b95Fdb290148"
+        "eth:0xA667498F46457548f1D3ad557340b95Fdb290148"
      values.$pastUpgrades.1.2.0:
-        "0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"
+        "eth:0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"
      values.$pastUpgrades.2.2.0:
-        "0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"
+        "eth:0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"
      values.$pastUpgrades.3.2.0:
-        "0x90438AD3d81a0739ce1Cb20C73564682388c5FdD"
+        "eth:0x90438AD3d81a0739ce1Cb20C73564682388c5FdD"
      values.$pastUpgrades.4.2.0:
-        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
+        "eth:0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
      values.$pastUpgrades.5.2.0:
-        "0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
+        "eth:0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
      values.$pastUpgrades.6.2.0:
-        "0x48Dcf75EA18233BA947E4480dCd70594720449C1"
+        "eth:0x48Dcf75EA18233BA947E4480dCd70594720449C1"
      values.$pastUpgrades.7.2.0:
-        "0xD576931ab0bDC3dfdc2c041d3C7b9d2ED0c6dd9a"
+        "eth:0xD576931ab0bDC3dfdc2c041d3C7b9d2ED0c6dd9a"
      values.$pastUpgrades.8.2.0:
-        "0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a"
+        "eth:0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a"
      values.$pastUpgrades.9.2.0:
-        "0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80"
+        "eth:0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80"
      values.crossDomainAdmin:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+++ severity: HIGH
      values.owner:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      values.withdrawalRecipient:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      values.wrappedNativeToken:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5:
-        "ERC1967Proxy"
      implementationNames.0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80:
-        "Ethereum_SpokePool"
      implementationNames.eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5:
+        "ERC1967Proxy"
      implementationNames.eth:0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80:
+        "Ethereum_SpokePool"
    }
```

```diff
    contract ZkStack_CustomGasToken_Adapter (0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
+        "eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.CUSTOM_GAS_TOKEN:
-        "0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a"
+        "eth:0x1ff1dC3cB9eeDbC6Eb2d99C03b30A05cA625fB5a"
      values.CUSTOM_GAS_TOKEN_FUNDER:
-        "0x0d57392895Db5aF3280e9223323e20F3951E81B1"
+        "eth:0x0d57392895Db5aF3280e9223323e20F3951E81B1"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.L2_REFUND_ADDRESS:
-        "0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
+        "eth:0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
      values.USDC_SHARED_BRIDGE:
-        "0xf553E6D903AA43420ED7e3bc2313bE9286A8F987"
+        "eth:0xf553E6D903AA43420ED7e3bc2313bE9286A8F987"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf:
-        "ZkStack_CustomGasToken_Adapter"
      implementationNames.eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf:
+        "ZkStack_CustomGasToken_Adapter"
    }
```

```diff
    contract Alephzero_Adapter (0x6F4083304C2cA99B077ACE06a5DcF670615915Af) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
+        "eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.CUSTOM_GAS_TOKEN:
-        "0xdD0ae774F7E300CdAA4EA371cD55169665Ee6AFe"
+        "eth:0xdD0ae774F7E300CdAA4EA371cD55169665Ee6AFe"
      values.CUSTOM_GAS_TOKEN_FUNDER:
-        "0x0d57392895Db5aF3280e9223323e20F3951E81B1"
+        "eth:0x0d57392895Db5aF3280e9223323e20F3951E81B1"
      values.L1_ERC20_GATEWAY_ROUTER:
-        "0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
+        "eth:0xeBb17f398ed30d02F2e8733e7c1e5cf566e17812"
      values.L1_INBOX:
-        "0x56D8EC76a421063e1907503aDd3794c395256AEb"
+        "eth:0x56D8EC76a421063e1907503aDd3794c395256AEb"
      values.L2_REFUND_L2_ADDRESS:
-        "0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
+        "eth:0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
      values.usdcToken:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0x6F4083304C2cA99B077ACE06a5DcF670615915Af:
-        "Arbitrum_CustomGasToken_Adapter"
      implementationNames.eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af:
+        "Arbitrum_CustomGasToken_Adapter"
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      address:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.emergencyProposer:
-        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.getMember.0:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.getMember.1:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      values.getMember.2:
-        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.proposer:
-        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      implementationNames.0x7b292034084A41B9D441B71b6E3557Edd0463fa8:
-        "GovernorV2"
      implementationNames.eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8:
+        "GovernorV2"
    }
```

```diff
    contract Ink_Adapter (0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2"
+        "eth:0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_OP_USDC_BRIDGE:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_STANDARD_BRIDGE:
-        "0x88FF1e5b602916615391F55854588EFcBB7663f0"
+        "eth:0x88FF1e5b602916615391F55854588EFcBB7663f0"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
+        "eth:0x69d3Cf86B2Bf1a9e99875B7e2D9B6a84426c171f"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2:
-        "OP_Adapter"
      implementationNames.eth:0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2:
+        "OP_Adapter"
    }
```

```diff
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      address:
-        "0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
+        "eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
+        "eth:0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5"
      values.$members.1:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "eth:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.$members.2:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "eth:0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.$members.3:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "eth:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      implementationNames.0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a:
-        "Proxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a:
+        "Proxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    EOA  (0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe) {
    +++ description: None
      address:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "eth:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
    }
```

```diff
    EOA  (0x868CF19464e17F76D6419ACC802B122c22D2FD34) {
    +++ description: None
      address:
-        "0x868CF19464e17F76D6419ACC802B122c22D2FD34"
+        "eth:0x868CF19464e17F76D6419ACC802B122c22D2FD34"
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
      address:
-        "0x8692B776d1Ff0664177c90465038056Dc64f8991"
+        "eth:0x8692B776d1Ff0664177c90465038056Dc64f8991"
      values.avatar:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      values.collateral:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.escalationManager:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.getGuard:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.guard:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.optimisticOracleV3:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.owner:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      values.target:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      values.ZodiacModule_avatar:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      values.ZodiacModule_guard:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.ZodiacModule_target:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      implementationNames.0x8692B776d1Ff0664177c90465038056Dc64f8991:
-        "OptimisticGovernor"
      implementationNames.eth:0x8692B776d1Ff0664177c90465038056Dc64f8991:
+        "OptimisticGovernor"
    }
```

```diff
    contract WorldChain_Adapter (0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
+        "eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
      values.cctpTokenMessenger:
-        "0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
+        "eth:0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d"
      values.L1_STANDARD_BRIDGE:
-        "0x470458C91978D2d929704489Ad730DC3E3001113"
+        "eth:0x470458C91978D2d929704489Ad730DC3E3001113"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0xf931a81D18B1766d15695ffc7c1920a62b7e710a"
+        "eth:0xf931a81D18B1766d15695ffc7c1920a62b7e710a"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1:
-        "WorldChain_Adapter"
      implementationNames.eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1:
+        "WorldChain_Adapter"
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      address:
-        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      description:
-        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a."
+        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a."
      values.executor:
-        "0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
+        "eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a"
      values.governor:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.token:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      implementationNames.0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748:
-        "EmergencyProposer"
      implementationNames.eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748:
+        "EmergencyProposer"
    }
```

```diff
    EOA  (0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9) {
    +++ description: None
      address:
-        "0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9"
+        "eth:0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9"
    }
```

```diff
    contract FixedSlashSlashingLibrary (0x9a406ba5a99983250Fd663947b3c968D387ce5cd) {
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
      address:
-        "0x9a406ba5a99983250Fd663947b3c968D387ce5cd"
+        "eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd"
      implementationNames.0x9a406ba5a99983250Fd663947b3c968D387ce5cd:
-        "FixedSlashSlashingLibrary"
      implementationNames.eth:0x9a406ba5a99983250Fd663947b3c968D387ce5cd:
+        "FixedSlashSlashingLibrary"
    }
```

```diff
    EOA  (0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D) {
    +++ description: None
      address:
-        "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
    }
```

```diff
    contract Solana_Adapter (0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
+        "eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
      values.cctpMessageTransmitter:
-        "0x0a992d191DEeC32aFe36203Ad87D7d289a738F81"
+        "eth:0x0a992d191DEeC32aFe36203Ad87D7d289a738F81"
      values.cctpTokenMessenger:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.SOLANA_SPOKE_POOL_ADDRESS:
-        "0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
+        "eth:0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
      values.SOLANA_USDC_ADDRESS:
-        "0xaBc97431B1Bbe4C2D2f6E0E47ca60203452f5d61"
+        "eth:0xaBc97431B1Bbe4C2D2f6E0E47ca60203452f5d61"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3:
-        "Solana_Adapter"
      implementationNames.eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3:
+        "Solana_Adapter"
    }
```

```diff
    contract ZkStack_Adapter (0xA374585E6062517Ee367ee5044946A6fBe17724f) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xA374585E6062517Ee367ee5044946A6fBe17724f"
+        "eth:0xA374585E6062517Ee367ee5044946A6fBe17724f"
      values.BRIDGE_HUB:
-        "0x303a465B659cBB0ab36eE643eA362c509EEb5213"
+        "eth:0x303a465B659cBB0ab36eE643eA362c509EEb5213"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.L2_REFUND_ADDRESS:
-        "0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
+        "eth:0x07aE8551Be970cB1cCa11Dd7a11F47Ae82e70E67"
      values.SHARED_BRIDGE:
-        "0x8829AD80E425C646DAB305381ff105169FeEcE56"
+        "eth:0x8829AD80E425C646DAB305381ff105169FeEcE56"
      implementationNames.0xA374585E6062517Ee367ee5044946A6fBe17724f:
-        "ZkStack_Adapter"
      implementationNames.eth:0xA374585E6062517Ee367ee5044946A6fBe17724f:
+        "ZkStack_Adapter"
    }
```

```diff
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xb4AeF0178f5725392A26eE18684C2aB62adc912e"
+        "eth:0xb4AeF0178f5725392A26eE18684C2aB62adc912e"
      values.cctpTokenMessenger:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.DEPOSIT_MANAGER:
-        "0x401F6c983eA34274ec46f84D70b31C151321188b"
+        "eth:0x401F6c983eA34274ec46f84D70b31C151321188b"
      values.ERC20_PREDICATE:
-        "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf"
+        "eth:0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf"
      values.FX_STATE_SENDER:
-        "0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
+        "eth:0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2"
      values.L1_MATIC:
-        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
+        "eth:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.ROOT_CHAIN_MANAGER:
-        "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
+        "eth:0xA0c68C638235ee32657e8f720a23ceC1bFc77C77"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xb4AeF0178f5725392A26eE18684C2aB62adc912e:
-        "Polygon_Adapter"
      implementationNames.eth:0xb4AeF0178f5725392A26eE18684C2aB62adc912e:
+        "Polygon_Adapter"
    }
```

```diff
    contract Across Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      address:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      values.$implementation:
-        "0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
+        "eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552"
      values.$members.0:
-        "0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
+        "eth:0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05"
      values.$members.1:
-        "0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
+        "eth:0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"
      values.$members.2:
-        "0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9"
+        "eth:0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9"
      values.$members.3:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "eth:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
      values.$members.4:
-        "0x868CF19464e17F76D6419ACC802B122c22D2FD34"
+        "eth:0x868CF19464e17F76D6419ACC802B122c22D2FD34"
      values.GnosisSafe_modules.0:
-        "0x8692B776d1Ff0664177c90465038056Dc64f8991"
+        "eth:0x8692B776d1Ff0664177c90465038056Dc64f8991"
      implementationNames.0xB524735356985D2f267FA010D681f061DfF03715:
-        "GnosisSafeProxy"
      implementationNames.0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
-        "GnosisSafe"
      implementationNames.eth:0xB524735356985D2f267FA010D681f061DfF03715:
+        "GnosisSafeProxy"
      implementationNames.eth:0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552:
+        "GnosisSafe"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 1h and a bond amount of 0.45 ABT.
      address:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      values.Adapters.1:
-        "0x527E872a5c3f0C7c24Fe33F2593cFB890a285084"
+        "eth:0x527E872a5c3f0C7c24Fe33F2593cFB890a285084"
      values.Adapters.10:
-        "0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b"
+        "eth:0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b"
      values.Adapters.56:
-        "0x22001f37B586792F25Ef9d19d99537C6446e0833"
+        "eth:0x22001f37B586792F25Ef9d19d99537C6446e0833"
      values.Adapters.130:
-        "0xFADcC43096756e1527306FD92982FEbBe3c629Fa"
+        "eth:0xFADcC43096756e1527306FD92982FEbBe3c629Fa"
      values.Adapters.137:
-        "0xb4AeF0178f5725392A26eE18684C2aB62adc912e"
+        "eth:0xb4AeF0178f5725392A26eE18684C2aB62adc912e"
      values.Adapters.232:
-        "0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
+        "eth:0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
      values.Adapters.288:
-        "0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3"
+        "eth:0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3"
      values.Adapters.324:
-        "0xA374585E6062517Ee367ee5044946A6fBe17724f"
+        "eth:0xA374585E6062517Ee367ee5044946A6fBe17724f"
      values.Adapters.480:
-        "0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
+        "eth:0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
      values.Adapters.690:
-        "0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
+        "eth:0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
      values.Adapters.1135:
-        "0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
+        "eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
      values.Adapters.1868:
-        "0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
+        "eth:0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
      values.Adapters.8453:
-        "0xE1421233BF7158A19f89F17c9735F9cbd3D9529c"
+        "eth:0xE1421233BF7158A19f89F17c9735F9cbd3D9529c"
      values.Adapters.34443:
-        "0xf1B59868697f3925b72889ede818B9E7ba0316d0"
+        "eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0"
      values.Adapters.41455:
-        "0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
+        "eth:0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
      values.Adapters.42161:
-        "0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210"
+        "eth:0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210"
      values.Adapters.57073:
-        "0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2"
+        "eth:0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2"
      values.Adapters.59144:
-        "0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
+        "eth:0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
      values.Adapters.81457:
-        "0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
+        "eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
      values.Adapters.534352:
-        "0x2DA799c2223c6ffB595e578903AE6b95839160d8"
+        "eth:0x2DA799c2223c6ffB595e578903AE6b95839160d8"
      values.Adapters.7777777:
-        "0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
+        "eth:0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
      values.Adapters.34268394551451:
-        "0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
+        "eth:0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
      values.bondToken:
-        "0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      values.CrossChainContracts.1:
-        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.CrossChainContracts.10:
-        "0x6f26Bf09B1C792e3228e5467807a900A503c0281"
+        "eth:0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.CrossChainContracts.56:
-        "0x4e8E101924eDE233C13e2D8622DC8aED2872d505"
+        "eth:0x4e8E101924eDE233C13e2D8622DC8aED2872d505"
      values.CrossChainContracts.130:
-        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
+        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.137:
-        "0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
+        "eth:0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
      values.CrossChainContracts.232:
-        "0xe7cb3e167e7475dE1331Cf6E0CEb187654619E12"
+        "eth:0xe7cb3e167e7475dE1331Cf6E0CEb187654619E12"
      values.CrossChainContracts.288:
-        "0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"
+        "eth:0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"
      values.CrossChainContracts.324:
-        "0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"
+        "eth:0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"
      values.CrossChainContracts.480:
-        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
+        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.690:
-        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
+        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.1135:
-        "0x9552a0a6624A23B848060AE5901659CDDa1f83f8"
+        "eth:0x9552a0a6624A23B848060AE5901659CDDa1f83f8"
      values.CrossChainContracts.1868:
-        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
+        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.8453:
-        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
+        "eth:0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.34443:
-        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
+        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.41455:
-        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
+        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.42161:
-        "0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"
+        "eth:0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"
      values.CrossChainContracts.57073:
-        "0xeF684C38F94F48775959ECf2012D7E864ffb9dd4"
+        "eth:0xeF684C38F94F48775959ECf2012D7E864ffb9dd4"
      values.CrossChainContracts.59144:
-        "0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"
+        "eth:0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"
      values.CrossChainContracts.81457:
-        "0x2D509190Ed0172ba588407D4c2df918F955Cc6E1"
+        "eth:0x2D509190Ed0172ba588407D4c2df918F955Cc6E1"
      values.CrossChainContracts.534352:
-        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
+        "eth:0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.7777777:
-        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
+        "eth:0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
      values.CrossChainContracts.34268394551451:
-        "0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
+        "eth:0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.lpTokenFactory:
-        "0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d"
+        "eth:0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d"
+++ severity: HIGH
      values.owner:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      values.protocolFeeCaptureAddress:
-        "0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
+        "eth:0x9A8f92a830A5cB89a3816e3D267CB7791c16b04D"
      values.spokePool:
-        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.timerAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.weth:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      implementationNames.0xc186fA914353c44b2E33eBE05f21846F1048bEda:
-        "HubPool"
      implementationNames.eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda:
+        "HubPool"
    }
```

```diff
    EOA  (0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d) {
    +++ description: None
      address:
-        "0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
+        "eth:0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d"
    }
```

```diff
    contract IdentifierWhitelist (0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570) {
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
      address:
-        "0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
+        "eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570:
-        "IdentifierWhitelist"
      implementationNames.eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570:
+        "IdentifierWhitelist"
    }
```

```diff
    contract AddressWhitelist (0xdBF90434dF0B98219f87d112F37d74B1D90758c7) {
    +++ description: Implements a simple address whitelist for tokens that can be used as bonds and fees.
      address:
-        "0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
+        "eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
      values.getWhitelist.0:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.getWhitelist.1:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.getWhitelist.2:
-        "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D"
+        "eth:0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D"
      values.getWhitelist.3:
-        "0xeca82185adCE47f39c684352B0439f030f860318"
+        "eth:0xeca82185adCE47f39c684352B0439f030f860318"
      values.getWhitelist.4:
-        "0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0"
+        "eth:0x261b45D85cCFeAbb11F022eBa346ee8D1cd488c0"
      values.getWhitelist.5:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.getWhitelist.6:
-        "0xdAC17F958D2ee523a2206206994597C13D831ec7"
+        "eth:0xdAC17F958D2ee523a2206206994597C13D831ec7"
      values.getWhitelist.7:
-        "0x758A43EE2BFf8230eeb784879CdcFF4828F2544D"
+        "eth:0x758A43EE2BFf8230eeb784879CdcFF4828F2544D"
      values.getWhitelist.8:
-        "0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3"
+        "eth:0xBD2F0Cd039E0BFcf88901C98c0bFAc5ab27566e3"
      values.getWhitelist.9:
-        "0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28"
+        "eth:0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28"
      values.getWhitelist.10:
-        "0x3832d2F059E55934220881F831bE501D180671A7"
+        "eth:0x3832d2F059E55934220881F831bE501D180671A7"
      values.getWhitelist.11:
-        "0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
+        "eth:0x967da4048cD07aB37855c090aAF366e4ce1b9F48"
      values.getWhitelist.12:
-        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
+        "eth:0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      values.getWhitelist.13:
-        "0x0AaCfbeC6a24756c20D41914F2caba817C0d8521"
+        "eth:0x0AaCfbeC6a24756c20D41914F2caba817C0d8521"
      values.getWhitelist.14:
-        "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
+        "eth:0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9"
      values.getWhitelist.15:
-        "0x514910771AF9Ca656af840dff83E8264EcF986CA"
+        "eth:0x514910771AF9Ca656af840dff83E8264EcF986CA"
      values.getWhitelist.16:
-        "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
+        "eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
      values.getWhitelist.17:
-        "0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
+        "eth:0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828"
      values.getWhitelist.18:
-        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
+        "eth:0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
      values.getWhitelist.19:
-        "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940"
+        "eth:0xBb2b8038a1640196FbE3e38816F3e67Cba72D940"
      values.getWhitelist.20:
-        "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
+        "eth:0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc"
      values.getWhitelist.21:
-        "0xd3d2E2692501A5c9Ca623199D38826e513033a17"
+        "eth:0xd3d2E2692501A5c9Ca623199D38826e513033a17"
      values.getWhitelist.22:
-        "0x88D97d199b9ED37C29D846d00D443De980832a22"
+        "eth:0x88D97d199b9ED37C29D846d00D443De980832a22"
      values.getWhitelist.23:
-        "0xa117000000f279D81A1D3cc75430fAA017FA5A2e"
+        "eth:0xa117000000f279D81A1D3cc75430fAA017FA5A2e"
      values.getWhitelist.24:
-        "0x0954906da0Bf32d5479e25f46056d22f08464cab"
+        "eth:0x0954906da0Bf32d5479e25f46056d22f08464cab"
      values.getWhitelist.25:
-        "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b"
+        "eth:0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b"
      values.getWhitelist.26:
-        "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
+        "eth:0x6B3595068778DD592e39A122f4f5a5cF09C90fE2"
      values.getWhitelist.27:
-        "0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272"
+        "eth:0x8798249c2E607446EfB7Ad49eC89dD1865Ff4272"
      values.getWhitelist.28:
-        "0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
+        "eth:0x0f7F961648aE6Db43C75663aC7E5414Eb79b5704"
      values.getWhitelist.29:
-        "0xba100000625a3754423978a60c9317c58a424e3D"
+        "eth:0xba100000625a3754423978a60c9317c58a424e3D"
      values.getWhitelist.30:
-        "0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a"
+        "eth:0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a"
      values.getWhitelist.31:
-        "0x0000000000095413afC295d19EDeb1Ad7B71c952"
+        "eth:0x0000000000095413afC295d19EDeb1Ad7B71c952"
      values.getWhitelist.32:
-        "0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074"
+        "eth:0x69af81e73A73B40adF4f3d4223Cd9b1ECE623074"
      values.getWhitelist.33:
-        "0x24A6A37576377F63f194Caa5F518a60f45b42921"
+        "eth:0x24A6A37576377F63f194Caa5F518a60f45b42921"
      values.getWhitelist.34:
-        "0xb753428af26E81097e7fD17f40c88aaA3E04902c"
+        "eth:0xb753428af26E81097e7fD17f40c88aaA3E04902c"
      values.getWhitelist.35:
-        "0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421"
+        "eth:0x1b40183EFB4Dd766f11bDa7A7c3AD8982e998421"
      values.getWhitelist.36:
-        "0x853d955aCEf822Db058eb8505911ED77F175b99e"
+        "eth:0x853d955aCEf822Db058eb8505911ED77F175b99e"
      values.getWhitelist.37:
-        "0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0"
+        "eth:0x5F64Ab1544D28732F0A24F4713c2C8ec0dA089f0"
      values.getWhitelist.38:
-        "0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a"
+        "eth:0x0258F474786DdFd37ABCE6df6BBb1Dd5dfC4434a"
      values.getWhitelist.39:
-        "0x0391D2021f89DC339F60Fff84546EA23E337750f"
+        "eth:0x0391D2021f89DC339F60Fff84546EA23E337750f"
      values.getWhitelist.40:
-        "0x69BbE2FA02b4D90A944fF328663667DC32786385"
+        "eth:0x69BbE2FA02b4D90A944fF328663667DC32786385"
      values.getWhitelist.41:
-        "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
+        "eth:0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"
      values.getWhitelist.42:
-        "0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
+        "eth:0x1571eD0bed4D987fe2b498DdBaE7DFA19519F651"
      values.getWhitelist.43:
-        "0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9"
+        "eth:0x5f18C75AbDAe578b483E5F43f12a39cF75b973a9"
      values.getWhitelist.44:
-        "0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
+        "eth:0xa47c8bf37f92aBed4A126BDA807A7b7498661acD"
      values.getWhitelist.45:
-        "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
+        "eth:0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C"
      values.getWhitelist.46:
-        "0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"
+        "eth:0x48Fb253446873234F2fEBbF9BdeAA72d9d387f94"
      values.getWhitelist.47:
-        "0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55"
+        "eth:0xBA11D00c5f74255f56a5E366F4F77f5A186d7f55"
      values.getWhitelist.48:
-        "0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F"
+        "eth:0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F"
      values.getWhitelist.49:
-        "0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44"
+        "eth:0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44"
      values.getWhitelist.50:
-        "0x2ba592F78dB6436527729929AAf6c908497cB200"
+        "eth:0x2ba592F78dB6436527729929AAf6c908497cB200"
      values.getWhitelist.51:
-        "0xC4C2614E694cF534D407Ee49F8E44D125E4681c4"
+        "eth:0xC4C2614E694cF534D407Ee49F8E44D125E4681c4"
      values.getWhitelist.52:
-        "0xBBc2AE13b23d715c30720F079fcd9B4a74093505"
+        "eth:0xBBc2AE13b23d715c30720F079fcd9B4a74093505"
      values.getWhitelist.53:
-        "0x69e8b9528CABDA89fe846C67675B5D73d463a916"
+        "eth:0x69e8b9528CABDA89fe846C67675B5D73d463a916"
      values.getWhitelist.54:
-        "0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c"
+        "eth:0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c"
      values.getWhitelist.55:
-        "0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919"
+        "eth:0x03ab458634910AaD20eF5f1C8ee96F1D6ac54919"
      values.getWhitelist.56:
-        "0xc00e94Cb662C3520282E6f5717214004A7f26888"
+        "eth:0xc00e94Cb662C3520282E6f5717214004A7f26888"
      values.getWhitelist.57:
-        "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
+        "eth:0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
      values.getWhitelist.58:
-        "0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF"
+        "eth:0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF"
      values.getWhitelist.59:
-        "0xa1faa113cbE53436Df28FF0aEe54275c13B40975"
+        "eth:0xa1faa113cbE53436Df28FF0aEe54275c13B40975"
      values.getWhitelist.60:
-        "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
+        "eth:0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2"
      values.getWhitelist.61:
-        "0x408e41876cCCDC0F92210600ef50372656052a38"
+        "eth:0x408e41876cCCDC0F92210600ef50372656052a38"
      values.getWhitelist.62:
-        "0xD533a949740bb3306d119CC777fa900bA034cd52"
+        "eth:0xD533a949740bb3306d119CC777fa900bA034cd52"
      values.getWhitelist.63:
-        "0xD291E7a03283640FDc51b121aC401383A46cC623"
+        "eth:0xD291E7a03283640FDc51b121aC401383A46cC623"
      values.getWhitelist.64:
-        "0x87d73E916D7057945c9BcD8cdd94e42A6F47f776"
+        "eth:0x87d73E916D7057945c9BcD8cdd94e42A6F47f776"
      values.getWhitelist.65:
-        "0x888888435FDe8e7d4c54cAb67f206e4199454c60"
+        "eth:0x888888435FDe8e7d4c54cAb67f206e4199454c60"
      values.getWhitelist.66:
-        "0x44564d0bd94343f72E3C8a0D22308B7Fa71DB0Bb"
+        "eth:0x44564d0bd94343f72E3C8a0D22308B7Fa71DB0Bb"
      values.getWhitelist.67:
-        "0x3472A5A71965499acd81997a54BBA8D852C6E53d"
+        "eth:0x3472A5A71965499acd81997a54BBA8D852C6E53d"
      values.getWhitelist.68:
-        "0x383518188C0C6d7730D91b2c03a03C837814a899"
+        "eth:0x383518188C0C6d7730D91b2c03a03C837814a899"
      values.getWhitelist.69:
-        "0x875773784Af8135eA0ef43b5a374AaD105c5D39e"
+        "eth:0x875773784Af8135eA0ef43b5a374AaD105c5D39e"
      values.getWhitelist.70:
-        "0x6810e776880C02933D47DB1b9fc05908e5386b96"
+        "eth:0x6810e776880C02933D47DB1b9fc05908e5386b96"
      values.getWhitelist.71:
-        "0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"
+        "eth:0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e"
      values.getWhitelist.72:
-        "0xad32A8e6220741182940c5aBF610bDE99E737b2D"
+        "eth:0xad32A8e6220741182940c5aBF610bDE99E737b2D"
      values.getWhitelist.73:
-        "0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
+        "eth:0x956F47F50A910163D8BF957Cf5846D573E7f87CA"
      values.getWhitelist.74:
-        "0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
+        "eth:0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B"
      values.getWhitelist.75:
-        "0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d"
+        "eth:0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d"
      values.getWhitelist.76:
-        "0xbEa98c05eEAe2f3bC8c3565Db7551Eb738c8CCAb"
+        "eth:0xbEa98c05eEAe2f3bC8c3565Db7551Eb738c8CCAb"
      values.getWhitelist.77:
-        "0x8888801aF4d980682e47f1A9036e589479e835C5"
+        "eth:0x8888801aF4d980682e47f1A9036e589479e835C5"
      values.getWhitelist.78:
-        "0x4104b135DBC9609Fc1A9490E61369036497660c8"
+        "eth:0x4104b135DBC9609Fc1A9490E61369036497660c8"
      values.getWhitelist.79:
-        "0xfe9A29aB92522D14Fc65880d817214261D8479AE"
+        "eth:0xfe9A29aB92522D14Fc65880d817214261D8479AE"
      values.getWhitelist.80:
-        "0x86772b1409b61c639EaAc9Ba0AcfBb6E238e5F83"
+        "eth:0x86772b1409b61c639EaAc9Ba0AcfBb6E238e5F83"
      values.getWhitelist.81:
-        "0x6123B0049F904d730dB3C36a31167D9d4121fA6B"
+        "eth:0x6123B0049F904d730dB3C36a31167D9d4121fA6B"
      values.getWhitelist.82:
-        "0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198"
+        "eth:0x2d94AA3e47d9D5024503Ca8491fcE9A2fB4DA198"
      values.getWhitelist.83:
-        "0x7815bDa662050D84718B988735218CFfd32f75ea"
+        "eth:0x7815bDa662050D84718B988735218CFfd32f75ea"
      values.getWhitelist.84:
-        "0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"
+        "eth:0xbbBBBBB5AA847A2003fbC6b5C16DF0Bd1E725f61"
      values.getWhitelist.85:
-        "0x5166E09628b696285E3A151e84FB977736a83575"
+        "eth:0x5166E09628b696285E3A151e84FB977736a83575"
      values.getWhitelist.86:
-        "0xB0e1fc65C1a741b4662B813eB787d369b8614Af1"
+        "eth:0xB0e1fc65C1a741b4662B813eB787d369b8614Af1"
      values.getWhitelist.87:
-        "0xbC396689893D065F41bc2C6EcbeE5e0085233447"
+        "eth:0xbC396689893D065F41bc2C6EcbeE5e0085233447"
      values.getWhitelist.88:
-        "0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7"
+        "eth:0x3Ec8798B81485A254928B70CDA1cf0A2BB0B74D7"
      values.getWhitelist.89:
-        "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
+        "eth:0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0"
      values.getWhitelist.90:
-        "0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb"
+        "eth:0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb"
      values.getWhitelist.91:
-        "0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
+        "eth:0x8A9C67fee641579dEbA04928c4BC45F66e26343A"
      values.getWhitelist.92:
-        "0xD34a24006b862f4E9936c506691539D6433aD297"
+        "eth:0xD34a24006b862f4E9936c506691539D6433aD297"
      values.getWhitelist.93:
-        "0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89"
+        "eth:0x0b15Ddf19D47E6a86A56148fb4aFFFc6929BcB89"
      values.getWhitelist.94:
-        "0xbA8A621b4a54e61C442F5Ec623687e2a942225ef"
+        "eth:0xbA8A621b4a54e61C442F5Ec623687e2a942225ef"
      values.getWhitelist.95:
-        "0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F"
+        "eth:0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F"
      values.getWhitelist.96:
-        "0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"
+        "eth:0x42bBFa2e77757C645eeaAd1655E0911a7553Efbc"
      values.getWhitelist.97:
-        "0xef5Fa9f3Dede72Ec306dfFf1A7eA0bB0A2F7046F"
+        "eth:0xef5Fa9f3Dede72Ec306dfFf1A7eA0bB0A2F7046F"
      values.getWhitelist.98:
-        "0xaa61D5dec73971CD4a026ef2820bB87b4a4Ed8d6"
+        "eth:0xaa61D5dec73971CD4a026ef2820bB87b4a4Ed8d6"
      values.getWhitelist.99:
-        "0x752Efadc0a7E05ad1BCCcDA22c141D01a75EF1e4"
+        "eth:0x752Efadc0a7E05ad1BCCcDA22c141D01a75EF1e4"
      values.getWhitelist.100:
-        "0xEd1480d12bE41d92F36f5f7bDd88212E381A3677"
+        "eth:0xEd1480d12bE41d92F36f5f7bDd88212E381A3677"
      values.getWhitelist.101:
-        "0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5"
+        "eth:0xcAfE001067cDEF266AfB7Eb5A286dCFD277f3dE5"
      values.getWhitelist.102:
-        "0xDC59ac4FeFa32293A95889Dc396682858d52e5Db"
+        "eth:0xDC59ac4FeFa32293A95889Dc396682858d52e5Db"
      values.getWhitelist.103:
-        "0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
+        "eth:0xB0c7a3Ba49C7a6EaBa6cD4a96C55a1391070Ac9A"
      values.getWhitelist.104:
-        "0xa5f2211B9b8170F694421f2046281775E8468044"
+        "eth:0xa5f2211B9b8170F694421f2046281775E8468044"
      values.getWhitelist.105:
-        "0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"
+        "eth:0x44108f0223A3C3028F5Fe7AEC7f9bb2E66beF82F"
      values.getWhitelist.106:
-        "0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0xdBF90434dF0B98219f87d112F37d74B1D90758c7:
-        "AddressWhitelist"
      implementationNames.eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7:
+        "AddressWhitelist"
    }
```

```diff
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xE1421233BF7158A19f89F17c9735F9cbd3D9529c"
+        "eth:0xE1421233BF7158A19f89F17c9735F9cbd3D9529c"
      values.cctpTokenMessenger:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.L1_STANDARD_BRIDGE:
-        "0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
+        "eth:0x3154Cf16ccdb4C6d922629664174b904d80F2C35"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
+        "eth:0x866E82a600A1414e583f7F13623F1aC5d58b0Afa"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xE1421233BF7158A19f89F17c9735F9cbd3D9529c:
-        "Base_Adapter"
      implementationNames.eth:0xE1421233BF7158A19f89F17c9735F9cbd3D9529c:
+        "Base_Adapter"
    }
```

```diff
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b"
+        "eth:0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b"
      values.cctpTokenMessenger:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.DAI:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.DAI_OPTIMISM_BRIDGE:
-        "0x10E6593CDda8c58a1d0f14C5164B376352a55f2F"
+        "eth:0x10E6593CDda8c58a1d0f14C5164B376352a55f2F"
      values.L1_STANDARD_BRIDGE:
-        "0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
+        "eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
+        "eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1"
      values.SNX:
-        "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
+        "eth:0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F"
      values.SNX_OPTIMISM_BRIDGE:
-        "0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F"
+        "eth:0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b:
-        "Optimism_Adapter"
      implementationNames.eth:0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b:
+        "Optimism_Adapter"
    }
```

```diff
    contract AcrossBondToken (ABT) (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) {
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
      address:
-        "0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      values.hubPool:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      values.owner:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
+++ severity: HIGH
      values.proposers.0:
-        "0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c"
+        "eth:0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c"
      implementationNames.0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea:
-        "BondToken"
      implementationNames.eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea:
+        "BondToken"
    }
```

```diff
    contract SkinnyOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24) {
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
      address:
-        "0xeE3Afe347D5C74317041E2618C49534dAf887c24"
+        "eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.timerAddress:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      implementationNames.0xeE3Afe347D5C74317041E2618C49534dAf887c24:
-        "SkinnyOptimisticOracle"
      implementationNames.eth:0xeE3Afe347D5C74317041E2618C49534dAf887c24:
+        "SkinnyOptimisticOracle"
    }
```

```diff
    contract Lisk_Adapter (0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
+        "eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_OP_USDC_BRIDGE:
-        "0xE3622468Ea7dD804702B56ca2a4f88C0936995e6"
+        "eth:0xE3622468Ea7dD804702B56ca2a4f88C0936995e6"
      values.L1_STANDARD_BRIDGE:
-        "0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
+        "eth:0x2658723Bf70c7667De6B25F99fcce13A16D25d08"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
+        "eth:0x31B72D76FB666844C41EdF08dF0254875Dbb7edB"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b:
-        "OP_Adapter"
      implementationNames.eth:0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b:
+        "OP_Adapter"
    }
```

```diff
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xf1B59868697f3925b72889ede818B9E7ba0316d0"
+        "eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_STANDARD_BRIDGE:
-        "0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
+        "eth:0x735aDBbE72226BD52e818E7181953f42E3b0FF21"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
+        "eth:0x95bDCA6c8EdEB69C98Bd5bd17660BaCef1298A6f"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xf1B59868697f3925b72889ede818B9E7ba0316d0:
-        "Mode_Adapter"
      implementationNames.eth:0xf1B59868697f3925b72889ede818B9E7ba0316d0:
+        "Mode_Adapter"
    }
```

```diff
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
+        "eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
      values.cctpTokenMessenger:
-        "0x0000000000000000000000000000000000000000"
+        "eth:0x0000000000000000000000000000000000000000"
      values.L1_BLAST_BRIDGE:
-        "0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
+        "eth:0x3a05E5d33d7Ab3864D53aaEc93c8301C1Fa49115"
      values.L1_DAI:
-        "0x6B175474E89094C44Da98b954EedeAC495271d0F"
+        "eth:0x6B175474E89094C44Da98b954EedeAC495271d0F"
      values.L1_STANDARD_BRIDGE:
-        "0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
+        "eth:0x697402166Fbf2F22E970df8a6486Ef171dbfc524"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0"
+        "eth:0x5D4472f31Bd9385709ec61305AFc749F0fA8e9d0"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xF2bEf5E905AAE0295003ab14872F811E914EdD81:
-        "Blast_Adapter"
      implementationNames.eth:0xF2bEf5E905AAE0295003ab14872F811E914EdD81:
+        "Blast_Adapter"
    }
```

```diff
    EOA  (0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c) {
    +++ description: None
      address:
-        "0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c"
+        "eth:0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c"
    }
```

```diff
    contract DoctorWho_Adapter (0xFADcC43096756e1527306FD92982FEbBe3c629Fa) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      address:
-        "0xFADcC43096756e1527306FD92982FEbBe3c629Fa"
+        "eth:0xFADcC43096756e1527306FD92982FEbBe3c629Fa"
      values.cctpTokenMessenger:
-        "0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
+        "eth:0xBd3fa81B58Ba92a82136038B25aDec7066af3155"
      values.L1_STANDARD_BRIDGE:
-        "0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
+        "eth:0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA"
      values.L1_WETH:
-        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
+        "eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      values.MESSENGER:
-        "0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
+        "eth:0x9A3D64E386C18Cb1d6d5179a9596A4B5736e98A6"
      values.usdcToken:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      implementationNames.0xFADcC43096756e1527306FD92982FEbBe3c629Fa:
-        "DoctorWho_Adapter"
      implementationNames.eth:0xFADcC43096756e1527306FD92982FEbBe3c629Fa:
+        "DoctorWho_Adapter"
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      address:
-        "0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
      values.cachedOracle:
-        "0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
+        "eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
      values.defaultCurrency:
-        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
+        "eth:0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      values.finder:
-        "0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      values.owner:
-        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      implementationNames.0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE:
-        "OptimisticOracleV3"
      implementationNames.eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE:
+        "OptimisticOracleV3"
    }
```

```diff
+   Status: CREATED
    contract VotingV2 (0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac)
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
```

```diff
+   Status: CREATED
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Soneium_Adapter (0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract HubPoolStore (0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61)
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages.
```

```diff
+   Status: CREATED
    contract Universal_Adapter (0x22001f37B586792F25Ef9d19d99537C6446e0833)
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the eth:0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain.
```

```diff
+   Status: CREATED
    contract Scroll_Adapter (0x2DA799c2223c6ffB595e578903AE6b95839160d8)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract AcrossConfigStore (0x3B03509645713718B78951126E0A6de6f10043f5)
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
```

```diff
+   Status: CREATED
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE)
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
```

```diff
+   Status: CREATED
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3)
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
```

```diff
+   Status: CREATED
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
```

```diff
+   Status: CREATED
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Store (0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF)
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract Linea_Adapter (0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5)
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
```

```diff
+   Status: CREATED
    contract ZkStack_CustomGasToken_Adapter (0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Alephzero_Adapter (0x6F4083304C2cA99B077ACE06a5DcF670615915Af)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8)
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
```

```diff
+   Status: CREATED
    contract Ink_Adapter (0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991)
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
```

```diff
+   Status: CREATED
    contract WorldChain_Adapter (0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748)
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by eth:0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
```

```diff
+   Status: CREATED
    contract FixedSlashSlashingLibrary (0x9a406ba5a99983250Fd663947b3c968D387ce5cd)
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
```

```diff
+   Status: CREATED
    contract Solana_Adapter (0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract ZkStack_Adapter (0xA374585E6062517Ee367ee5044946A6fBe17724f)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Across Multisig (0xB524735356985D2f267FA010D681f061DfF03715)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda)
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 1h and a bond amount of 0.45 ABT.
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570)
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (0xdBF90434dF0B98219f87d112F37d74B1D90758c7)
    +++ description: Implements a simple address whitelist for tokens that can be used as bonds and fees.
```

```diff
+   Status: CREATED
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract AcrossBondToken (ABT) (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea)
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
```

```diff
+   Status: CREATED
    contract SkinnyOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24)
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
```

```diff
+   Status: CREATED
    contract Lisk_Adapter (0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract DoctorWho_Adapter (0xFADcC43096756e1527306FD92982FEbBe3c629Fa)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

```diff
+   Status: CREATED
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE)
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
```

Generated with discovered.json: 0x64ab6887390487b6249dc7e7781de4a348253a25

# Diff at Mon, 07 Jul 2025 14:54:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7d0fdd1242b42b3e5413cd39140cefe4c5d9eb10 block: 22865552
- current block number: 22867011

## Description

Provide description of changes. This section will be preserved.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22865552 (main branch discovery), not current.

```diff
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Soneium_Adapter (0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Arbitrum_Adapter (0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract HubPoolStore (0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61) {
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages.
      description:
-        "Simple data store used by the Universal_Adapter to store message calldata hashes."
+        "Simple data store used by the Universal_Adapter to store message calldata hashes. The content of this calldata can be proven by Ethereum zk light clients on remote chains and then executed to relay root bundles or arbitrary messages."
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract Universal_Adapter (0x22001f37B586792F25Ef9d19d99537C6446e0833) {
    +++ description: This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the 0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain.
      template:
-        "acrossv3/adapter"
+        "acrossv3/universalAdapter"
      description:
-        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
+        "This adapter can be used to send messages / root bundles to chains that do not have a canonical adapter. It stores calldata in the 0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61 on Ethereum, which can then be zk proven on a remote chain."
      category.name:
-        "External Bridges"
+        "Local Infrastructure"
      category.priority:
-        1
+        5
    }
```

```diff
    contract Scroll_Adapter (0x2DA799c2223c6ffB595e578903AE6b95839160d8) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Linea_Adapter (0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract ZkStack_CustomGasToken_Adapter (0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Alephzero_Adapter (0x6F4083304C2cA99B077ACE06a5DcF670615915Af) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Ink_Adapter (0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract WorldChain_Adapter (0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Solana_Adapter (0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract ZkStack_Adapter (0xA374585E6062517Ee367ee5044946A6fBe17724f) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Lisk_Adapter (0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

```diff
    contract DoctorWho_Adapter (0xFADcC43096756e1527306FD92982FEbBe3c629Fa) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      template:
-        "acrossv3/adapter"
+        "acrossv3/Adapter"
    }
```

Generated with discovered.json: 0x4de0b28750bf8d639de102e7af84feb054207e56

# Diff at Mon, 07 Jul 2025 06:37:18 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@1a6f89d35120c5c65bf077ab92a9ca72da48080d block: 22823774
- current block number: 22865552

## Description

Solana adapter (via circle CCTP) added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 1h and a bond amount of 0.45 ABT.
      values.Adapters.34268394551451:
+        "0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3"
      values.CrossChainContracts.34268394551451:
+        "0x5b162F2c7EC8795BD0800C1462949E2328D1DD5a"
    }
```

```diff
+   Status: CREATED
    contract Solana_Adapter (0x9F788694934fD2Ed34D5340B9a76EB34f2bFD7B3)
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Solana_Adapter.sol    | 695 +++++++++++++++++++++
 1 file changed, 695 insertions(+)
```

Generated with discovered.json: 0xd69a5e30f623dd65a12e45a3f26f870da47a03bd

# Diff at Fri, 04 Jul 2025 12:18:50 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f56dc47fe915564d4555300304da4d3bcbc087f block: 22823774
- current block number: 22823774

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22823774 (main branch discovery), not current.

```diff
    EOA  (0x2bAaA41d155ad8a4126184950B31F50A1513cE25) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      receivedPermissions.0.from:
-        "ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      receivedPermissions.0.from:
-        "ethereum:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
+        "eth:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"
      receivedPermissions.1.from:
-        "ethereum:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
+        "eth:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"
      receivedPermissions.2.from:
-        "ethereum:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
+        "eth:0x40f941E48A552bF496B154Af6bf55725f18D77c3"
      receivedPermissions.3.from:
-        "ethereum:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
+        "eth:0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      receivedPermissions.4.from:
-        "ethereum:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
+        "eth:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"
      receivedPermissions.5.from:
-        "ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      receivedPermissions.6.from:
-        "ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      receivedPermissions.7.from:
-        "ethereum:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
+        "eth:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"
      receivedPermissions.8.from:
-        "ethereum:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
+        "eth:0xdBF90434dF0B98219f87d112F37d74B1D90758c7"
      receivedPermissions.9.from:
-        "ethereum:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
+        "eth:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"
    }
```

```diff
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
+        "eth:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
      receivedPermissions.0.via.0.address:
-        "ethereum:0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      receivedPermissions.0.from:
-        "ethereum:0x3B03509645713718B78951126E0A6de6f10043f5"
+        "eth:0x3B03509645713718B78951126E0A6de6f10043f5"
      receivedPermissions.1.via.0.address:
-        "ethereum:0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      receivedPermissions.1.from:
-        "ethereum:0x8692B776d1Ff0664177c90465038056Dc64f8991"
+        "eth:0x8692B776d1Ff0664177c90465038056Dc64f8991"
      receivedPermissions.2.via.0.address:
-        "ethereum:0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      receivedPermissions.2.from:
-        "ethereum:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      receivedPermissions.3.via.0.address:
-        "ethereum:0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
      receivedPermissions.3.from:
-        "ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      directlyReceivedPermissions.0.from:
-        "ethereum:0xB524735356985D2f267FA010D681f061DfF03715"
+        "eth:0xB524735356985D2f267FA010D681f061DfF03715"
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      receivedPermissions.0.from:
-        "ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
+        "eth:0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
    }
```

```diff
    contract Across Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0x3B03509645713718B78951126E0A6de6f10043f5"
+        "eth:0x3B03509645713718B78951126E0A6de6f10043f5"
      receivedPermissions.1.from:
-        "ethereum:0x8692B776d1Ff0664177c90465038056Dc64f8991"
+        "eth:0x8692B776d1Ff0664177c90465038056Dc64f8991"
      receivedPermissions.2.from:
-        "ethereum:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
+        "eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      receivedPermissions.3.from:
-        "ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 1h and a bond amount of 0.45 ABT.
      directlyReceivedPermissions.0.from:
-        "ethereum:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      directlyReceivedPermissions.1.from:
-        "ethereum:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
+        "eth:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
    }
```

```diff
    EOA  (0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c) {
    +++ description: None
      receivedPermissions.0.from:
-        "ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
      receivedPermissions.1.from:
-        "ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
+        "eth:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea"
    }
```

Generated with discovered.json: 0x823833e03f6b9fd54c07f5c52ec01fcdeaa6d181

# Diff at Tue, 01 Jul 2025 10:30:49 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@6dae2e2c6da3c994ad2a4e3a50e7430960cb763e block: 22816998
- current block number: 22823774

## Description

Spokepool upgrade: minor fixes and [7702 delegation detection](https://disco.l2beat.com/diff/eth:0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a/eth:0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80?lines=R5649).

## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
      sourceHashes.1:
-        "0x10d81ccfd26fbcb9926942a46436a7bedd3946646911a43f3f0e13dc7eb81517"
+        "0x40060e8b2904995f3cb0149fcbf73924c9b1e2e164a823a7957d703a9f7c6fe5"
      values.$implementation:
-        "0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a"
+        "0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80"
      values.$pastUpgrades.9:
+        ["2025-06-30T17:21:23.000Z","0xa4cfc9525849a8a3052a587a29006303e9b16ce08fa096460bb6fe2017b1a3ef",["0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80"]]
      values.$upgradeCount:
-        9
+        10
      values.UPDATE_ADDRESS_DEPOSIT_DETAILS_HASH:
-        "0x9c6dfd61d811b9950a4f2b9adf46357b717c816d22c420d0bde8f2360148f7cd"
      implementationNames.0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a:
-        "Ethereum_SpokePool"
      implementationNames.0xFBc81a18EcDa8E6A91275cFDF5FC6d91A7C5AE80:
+        "Ethereum_SpokePool"
    }
```

## Source code changes

```diff
.../Ethereum_SpokePool/Ethereum_SpokePool.sol      | 65 ++++++++--------------
 1 file changed, 24 insertions(+), 41 deletions(-)
```

Generated with discovered.json: 0xa0b40952153894e314adca8c863e0d39a3eda492

# Diff at Mon, 30 Jun 2025 11:41:15 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- comparing to: main@8d994c18c6e642449f421c7342cea0f0650835d8 block: 22665827
- current block number: 22816998

## Description

discodrive, add UMA disco config.

## Watched changes

```diff
    contract VotingV2 (0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac) {
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
      values.rewardPerToken:
-        "627473210166767069"
+        "637167053348045646"
      values.rewardPerTokenStored:
-        "627389365474219770"
+        "637142462765695709"
    }
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22665827 (main branch discovery), not current.

```diff
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
-   Status: DELETED
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828)
    +++ description: None
```

```diff
    contract Soneium_Adapter (0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Arbitrum_Adapter (0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract HubPoolStore (0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61) {
    +++ description: Simple data store used by the Universal_Adapter to store message calldata hashes.
      template:
+        "acrossv3/HubPoolStore"
      description:
+        "Simple data store used by the Universal_Adapter to store message calldata hashes."
    }
```

```diff
    contract Universal_Adapter (0x22001f37B586792F25Ef9d19d99537C6446e0833) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Scroll_Adapter (0x2DA799c2223c6ffB595e578903AE6b95839160d8) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract AcrossConfigStore (0x3B03509645713718B78951126E0A6de6f10043f5) {
    +++ description: Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data.
      template:
+        "acrossv3/AcrossConfigStore"
      description:
+        "Simple, owner-controlled contract for storing protocol-wide, token-specific configuration data."
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: Maps interface names to contract addresses (UMA protocol contracts).
      values.namedAddresses:
+        [{"name":"Oracle","address":"0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac"},{"name":"Registry","address":"0x3e532e6222afe9Bcf02DCB87216802c75D5113aE"},{"name":"FinancialContractsAdmin","address":"0x4E6CCB1dA3C7844887F9A5aF4e8450d9fd90317A"},{"name":"Store","address":"0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF"},{"name":"IdentifierWhitelist","address":"0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570"},{"name":"CollateralWhitelist","address":"0xdBF90434dF0B98219f87d112F37d74B1D90758c7"},{"name":"OptimisticOracle","address":"0xC43767F4592DF265B4a9F1a398B97fF24F38C6A6"},{"name":"SkinnyOptimisticOracle","address":"0xeE3Afe347D5C74317041E2618C49534dAf887c24"},{"name":"OptimisticOracleV2","address":"0xA0Ae6609447e57a42c51B50EAe921D701823FFAe"},{"name":"OptimisticAsserter","address":"0x0000000000000000000000000000000000000000"},{"name":"OptimisticOracleV3","address":"0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE"}]
      template:
+        "uma/Finder"
      description:
+        "Maps interface names to contract addresses (UMA protocol contracts)."
      usedTypes:
+        [{"typeCaster":"Mapping","arg":{"0x4f7261636c650000000000000000000000000000000000000000000000000000":"Oracle","0x5265676973747279000000000000000000000000000000000000000000000000":"Registry","0x46696e616e6369616c436f6e74726163747341646d696e000000000000000000":"FinancialContractsAdmin","0x53746f7265000000000000000000000000000000000000000000000000000000":"Store","0x4964656e74696669657257686974656c69737400000000000000000000000000":"IdentifierWhitelist","0x436f6c6c61746572616c57686974656c69737400000000000000000000000000":"CollateralWhitelist","0x4f7074696d69737469634f7261636c6500000000000000000000000000000000":"OptimisticOracle","0x536b696e6e794f7074696d69737469634f7261636c6500000000000000000000":"SkinnyOptimisticOracle","0x4f7074696d69737469634f7261636c6556320000000000000000000000000000":"OptimisticOracleV2","0x4f7074696d697374696341737365727465720000000000000000000000000000":"OptimisticAsserter","0x4f7074696d69737469634f7261636c6556330000000000000000000000000000":"OptimisticOracleV3"}}]
    }
```

```diff
-   Status: DELETED
    contract PolygonTokenBridger (0x48d990AbDA20afa1fD1da713AbC041B60a922c65)
    +++ description: None
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens.
      template:
+        "uma/ProposerV2"
      description:
+        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000 UMA tokens."
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      category:
+        {"name":"Shared Infrastructure","priority":4}
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8","description":"propose governance actions.","role":".proposer"}]
    }
```

```diff
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Linea_Adapter (0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers.
      values.proxiableUUID:
-        "EXPECT_REVERT"
      template:
+        "acrossv3/SpokePool"
      description:
+        "The user-facing contract on each connected chain where funds are deposited to initiate a bridge transfer. It also receives settlement data from the HubPool to process refunds for the relayers who fulfilled those transfers."
      fieldMeta:
+        {"owner":{"severity":"HIGH"}}
      category:
+        {"name":"Local Infrastructure","priority":5}
    }
```

```diff
    contract ZkStack_CustomGasToken_Adapter (0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Alephzero_Adapter (0x6F4083304C2cA99B077ACE06a5DcF670615915Af) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes.
      values.emergencyProposer:
+        "0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748"
      values.owner:
+        "0x7b292034084A41B9D441B71b6E3557Edd0463fa8"
      values.proposer:
+        "0x50efaC9619225d7fB4703C5872da978849B6E7cC"
      template:
+        "uma/GovernorV2"
      description:
+        "Central UMA governance contract. It executes administrative proposals that have been passed by UMA token holder votes."
      category:
+        {"name":"Shared Infrastructure","priority":4}
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac","description":"set critical administrative parameters like migrating to a new contract and requesting governance actions (`requestPrice()`) directly.","role":".owner"},{"permission":"interact","from":"ethereum:0x3e532e6222afe9Bcf02DCB87216802c75D5113aE","description":"manage registered contracts.","role":".owner"},{"permission":"interact","from":"ethereum:0x40f941E48A552bF496B154Af6bf55725f18D77c3","description":"manage address mappings.","role":".owner"},{"permission":"interact","from":"ethereum:0x50efaC9619225d7fB4703C5872da978849B6E7cC","description":"set the bond amount.","role":".owner"},{"permission":"interact","from":"ethereum:0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF","description":"set fees for disputes and manage all roles in the contract.","role":".owner"},{"permission":"interact","from":"ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8","description":"manage all roles in the contract.","role":".owner"},{"permission":"interact","from":"ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748","description":"remove and slash proposals, set the bond amount and the expiry time, manage the executor address.","role":".owner"},{"permission":"interact","from":"ethereum:0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570","description":"manage the whitelist.","role":".owner"},{"permission":"interact","from":"ethereum:0xdBF90434dF0B98219f87d112F37d74B1D90758c7","description":"manage the addresses on the whitelist.","role":".owner"},{"permission":"interact","from":"ethereum:0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE","description":"set critical administrative parameters like default bonds, bond token, fees.","role":".owner"}]
    }
```

```diff
-   Status: DELETED
    contract LpTokenFactory (0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d)
    +++ description: None
```

```diff
    contract Ink_Adapter (0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract UMA Multisig (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      name:
-        "EmergencyProposalExecutor"
+        "UMA Multisig"
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748","description":"remove proposals, execute emergency proposals.","role":".executor"}]
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values.
      values.bondFmt:
+        "2"
      values.delayFmt:
+        "2d"
      template:
+        "uma/OptimisticGovernor"
      description:
+        "Optimistic Governance module allowing for proposals by anyone with a bond of 2 WETH. They become executable if not challenged within 2d. The rules for proposals can be read directly from the contract values."
      fieldMeta:
+        {"rules":{"description":"string of rules that a proposer is accepting when posting a proposal with a bond."}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x3B03509645713718B78951126E0A6de6f10043f5","description":"update configuration values.","role":".owner","via":[{"address":"ethereum:0xB524735356985D2f267FA010D681f061DfF03715"}]},{"permission":"interact","from":"ethereum:0x8692B776d1Ff0664177c90465038056Dc64f8991","description":"set guard, avatar, target, delay, identifier, escalationManager, bond token and amount.","role":".owner","via":[{"address":"ethereum:0xB524735356985D2f267FA010D681f061DfF03715"}]},{"permission":"interact","from":"ethereum:0xc186fA914353c44b2E33eBE05f21846F1048bEda","description":"pause the system, manage all fees, bonds and security parameters, manage tokens and chain support, and critical emergency actions like admin functions on remote SpokePools or deleting proposals (can steal funds).","role":".owner","via":[{"address":"ethereum:0xB524735356985D2f267FA010D681f061DfF03715"}]},{"permission":"interact","from":"ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea","description":"manage the proposer role.","role":".owner","via":[{"address":"ethereum:0xB524735356985D2f267FA010D681f061DfF03715"}]}]
    }
```

```diff
    contract WorldChain_Adapter (0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a.
      values.bondFmt:
+        "5,000,000"
      values.delayFmt:
+        "10d"
      template:
+        "uma/EmergencyProposer"
      description:
+        "Token governance contract allowing anyone to create a UMA governance proposal for a bond of 5,000,000 UMA tokens. This circumvents the UMA optimistic oracle but can only be executed or removed after 10d, and only by 0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a."
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x7b292034084A41B9D441B71b6E3557Edd0463fa8","description":"can bypass the voting system and execute proposals immediately.","role":".emergencyProposer"}]
    }
```

```diff
    contract ZkStack_Adapter (0xA374585E6062517Ee367ee5044946A6fBe17724f) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Across Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      name:
-        "HubPool Multisig"
+        "Across Multisig"
      receivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x3B03509645713718B78951126E0A6de6f10043f5","description":"update configuration values.","role":".owner"},{"permission":"interact","from":"ethereum:0x8692B776d1Ff0664177c90465038056Dc64f8991","description":"set guard, avatar, target, delay, identifier, escalationManager, bond token and amount.","role":".owner"},{"permission":"interact","from":"ethereum:0xc186fA914353c44b2E33eBE05f21846F1048bEda","description":"pause the system, manage all fees, bonds and security parameters, manage tokens and chain support, and critical emergency actions like admin functions on remote SpokePools or deleting proposals (can steal funds).","role":".owner"},{"permission":"interact","from":"ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea","description":"manage the proposer role.","role":".owner"}]
    }
```

```diff
-   Status: DELETED
    contract CoveredCallFinancialProductLibrary (0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 1h and a bond amount of 0.45 ABT.
      receivedPermissions:
-        [{"permission":"upgrade","from":"ethereum:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","role":"admin"}]
      values.bondAmountFmt:
+        "0.45"
      values.finalizationDelayFmt:
+        "1h"
      values.spokePool:
+        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      template:
+        "acrossv3/HubPool"
      description:
+        "The central L1 contract (hub) that manages liquidity from LPs and coordinates cross-chain settlements. It receives and secures settlement proposals (root bundles) using the UMA Optimistic Oracle, with a challenge period of 1h and a bond amount of 0.45 ABT."
      fieldMeta:
+        {"owner":{"severity":"HIGH"},"paused":{"severity":"HIGH"}}
      usedTypes:
+        [{"typeCaster":"Undecimal","arg":{"decimals":18}}]
      category:
+        {"name":"Local Infrastructure","priority":5}
      directlyReceivedPermissions:
+        [{"permission":"interact","from":"ethereum:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","description":"relay and delete root bundles, pause the contract, manage routes, set the withdrawal recipient (crosschain rebalancing target).","role":".owner"},{"permission":"upgrade","from":"ethereum:0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","role":"admin"}]
    }
```

```diff
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract AcrossBondToken (ABT) (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) {
    +++ description: A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals.
      name:
-        "BondToken"
+        "AcrossBondToken (ABT)"
      template:
+        "acrossv3/BondToken"
      description:
+        "A bond token wrapping ETH for usage in the Across protocol. Implements modified ERC20 logic to only allow permissioned proposers to use it as a bond for root bundle proposals."
      fieldMeta:
+        {"proposers":{"severity":"HIGH"}}
    }
```

```diff
    contract SkinnyOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24) {
    +++ description: Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution.
      name:
-        "UMAOptimisticOracle"
+        "SkinnyOptimisticOracle"
      template:
+        "uma/SkinnyOptimisticOracle"
      description:
+        "Validates bridge messages by allowing proposers to make bonded assertions about crosschain events. It enforces a challenge period during which any invalid claims can be disputed and escalated to UMA's Data Verification Mechanism (DVM) for resolution."
    }
```

```diff
    contract Lisk_Adapter (0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    EOA  (0xf7bAc63fc7CEaCf0589F25454Ecf5C2ce904997c) {
    +++ description: None
      receivedPermissions:
+        [{"permission":"acrossPropose","from":"ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea","role":".proposers"},{"permission":"interact","from":"ethereum:0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea","description":"use ABT as a bond to the HubPool contract for root bundle proposals.","role":".proposers"}]
    }
```

```diff
    contract DoctorWho_Adapter (0xFADcC43096756e1527306FD92982FEbBe3c629Fa) {
    +++ description: Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges.
      description:
+        "Modular, chain-specific contract that abstracts the communication logic for settlement between the HubPool and various SpokePools and their Relayers, often via canonical bridges."
      category:
+        {"name":"External Bridges","priority":1}
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes.
      template:
+        "uma/OptimisticOracleV3"
      description:
+        "Standard UMA optimistic oracle contract that allows anyone to make an arbitrary claim by posting a bond. The claim is considered true unless it is successfully disputed within a challenge window, with UMA's DVM acting as the final arbiter for disputes."
    }
```

```diff
+   Status: CREATED
    contract VotingV2 (0x004395edb43EFca9885CEdad51EC9fAf93Bd34ac)
    +++ description: Core smart contract for UMA's Data Verification Mechanism (DVM), serving as source of truth for disputed claims. UMA token holders collectively resolve price requests and earn rewards for correct participation. Commit- and reveal phases for the voting take 1d each.
```

```diff
+   Status: CREATED
    contract Registry (0x3e532e6222afe9Bcf02DCB87216802c75D5113aE)
    +++ description: Registry for contracts that are allowed to call `requestPrice()` in the UMA voting contracts (ie. request dispute resolution by the UMA DVM).
```

```diff
+   Status: CREATED
    contract Store (0x54f44eA3D2e7aA0ac089c4d8F7C93C27844057BF)
    +++ description: UMA protocol contract responsible for calculating and collecting regular and final fees for using the DVM.
```

```diff
+   Status: CREATED
    contract FixedSlashSlashingLibrary (0x9a406ba5a99983250Fd663947b3c968D387ce5cd)
    +++ description: Stores slashing parameters and calculates slashing amounts based on that (UMA protocol).
```

```diff
+   Status: CREATED
    contract IdentifierWhitelist (0xcF649d9Da4D1362C4DAEa67573430Bd6f945e570)
    +++ description: Keeps a list of whitelisted identifiers that are accepted by the UMA v3 protocol. Across uses the identifier `ACROSS-V2` for its disputes.
```

```diff
+   Status: CREATED
    contract AddressWhitelist (0xdBF90434dF0B98219f87d112F37d74B1D90758c7)
    +++ description: Implements a simple address whitelist for tokens that can be used as bonds and fees.
```

Generated with discovered.json: 0xf8b87edd4b99da687644e18a2aa77d2e0e28dbcd

# Diff at Mon, 09 Jun 2025 08:29:11 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@7cc006dadcc55e6cce3be3eb03d491835943fb43 block: 22517852
- current block number: 22665827

## Description

Upgrade worldchain adapter to support CCTPv2.

## Watched changes

```diff
-   Status: DELETED
    contract WorldChain_Adapter (0xA8399e221a583A57F54Abb5bA22f31b5D6C09f32)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.480:
-        "0xA8399e221a583A57F54Abb5bA22f31b5D6C09f32"
+        "0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1"
    }
```

```diff
+   Status: CREATED
    contract WorldChain_Adapter (0x8bbdD67102D743b8533c1277a4ffdA04Dea158D1)
    +++ description: None
```

## Source code changes

```diff
.../WorldChain_Adapter.sol                         | 121 ++++++++++++++-------
 1 file changed, 84 insertions(+), 37 deletions(-)
```

Generated with discovered.json: 0x6a374b7269092d9f4856136eb52f9a7cb8c8efbc

# Diff at Fri, 23 May 2025 09:40:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@69cd181abbc3c830a6caf2f4429b37cae72ffdb8 block: 22517852
- current block number: 22517852

## Description

Introduced .role field on each permission, defaulting to field name on which it was defined (with '.' prefix)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22517852 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: None
      directlyReceivedPermissions.0.role:
+        ".GnosisSafe_modules"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      receivedPermissions.0.role:
+        "admin"
    }
```

Generated with discovered.json: 0x6e39042f4aa91f926d93b33e393ed4a07a6a61c0

# Diff at Mon, 19 May 2025 15:19:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2ba4be7822b161a6616bac837b3f7f03225f5cb9 block: 22494917
- current block number: 22517852

## Description

Upgrade to the Linea_Adapter to use the general CCTP adapter.

## Watched changes

```diff
-   Status: DELETED
    contract Linea_Adapter (0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.59144:
-        "0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE"
+        "0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787"
    }
```

```diff
+   Status: CREATED
    contract Linea_Adapter (0x5A44A32c13e2C43416bFDE5dDF5DCb3880c42787)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@22494917 => .flat}/Linea_Adapter.sol    | 157 +++++++++++++++++++--
 1 file changed, 145 insertions(+), 12 deletions(-)
```

Generated with discovered.json: 0x037991be57e22885eb3db5d1e8fde2b0dfbc9871

# Diff at Fri, 16 May 2025 10:03:06 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@9912083f7b773804513e08ee765f8ba71a92980b block: 22397496
- current block number: 22494917

## Description

New Lisk adapter, based on generic OP adapter.

## Watched changes

```diff
-   Status: DELETED
    contract Lisk_Adapter (0x8229E812f20537caA1e8Fb41749b4887B8a75C3B)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.1135:
-        "0x8229E812f20537caA1e8Fb41749b4887B8a75C3B"
+        "0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b"
    }
```

```diff
+   Status: CREATED
    contract Lisk_Adapter (0xF039AdCC74936F90fE175e8b3FE0FdC8b8E0c73b)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@22397496 => .flat}/Lisk_Adapter.sol     | 114 ++++++++++++++++-----
 1 file changed, 87 insertions(+), 27 deletions(-)
```

Generated with discovered.json: 0xfc797ebe64af145b771a746c4334eff6db524485

# Diff at Fri, 02 May 2025 17:23:07 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@c598e33a0c469175b7abbd6c2a13b47b63d6b6a4 block: 22337715
- current block number: 22397496

## Description

ZkStack_CustomGasToken_Adapter upgraded to use native CCTP if enabled.

New Universal_Adapter added with CCTP support, currently not used.

## Watched changes

```diff
-   Status: DELETED
    contract ZkStack_CustomGasToken_Adapter (0x63AC22131eD457aeCbD63e6c4C7eeC7BBC74fF1F)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.232:
-        "0x63AC22131eD457aeCbD63e6c4C7eeC7BBC74fF1F"
+        "0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf"
      values.Adapters.56:
+        "0x22001f37B586792F25Ef9d19d99537C6446e0833"
      values.CrossChainContracts.56:
+        "0x4e8E101924eDE233C13e2D8622DC8aED2872d505"
    }
```

```diff
+   Status: CREATED
    contract HubPoolStore (0x1Ace3BbD69b63063F859514Eca29C9BDd8310E61)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Universal_Adapter (0x22001f37B586792F25Ef9d19d99537C6446e0833)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkStack_CustomGasToken_Adapter (0x5e0B7e20a77BDf11812837D30F1326068Bcf24Cf)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/HubPoolStore.sol      |  72 +++
 .../across-v3/ethereum/.flat/Universal_Adapter.sol | 597 +++++++++++++++++++++
 .../ZkStack_CustomGasToken_Adapter.sol             | 214 +++++++-
 3 files changed, 865 insertions(+), 18 deletions(-)
```

Generated with discovered.json: 0x7f3357bc67f9b24314960dee3b35bbaedcd7e9a4

# Diff at Tue, 29 Apr 2025 08:18:58 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22337715
- current block number: 22337715

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22337715 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      issuedPermissions:
-        [{"permission":"upgrade","to":"0xc186fA914353c44b2E33eBE05f21846F1048bEda","via":[]}]
    }
```

Generated with discovered.json: 0xd2b98cee46be677a29fb7fba20754a4948f35323

# Diff at Thu, 24 Apr 2025 08:36:05 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f3ec8b7fe4d902b94844aa2f7ddfb2affe4f3f61 block: 22187210
- current block number: 22337715

## Description

Upgrade the scroll adapter.

## Watched changes

```diff
-   Status: DELETED
    contract Scroll_Adapter (0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.534352:
-        "0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F"
+        "0x2DA799c2223c6ffB595e578903AE6b95839160d8"
    }
```

```diff
+   Status: CREATED
    contract Scroll_Adapter (0x2DA799c2223c6ffB595e578903AE6b95839160d8)
    +++ description: None
```

Generated with discovered.json: 0x3af056119078158b8cac1d38813cd3898c8a4fda

# Diff at Thu, 03 Apr 2025 08:31:29 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ad19dfb413ff34348157f743c194a146b6447e05 block: 22166242
- current block number: 22187210

## Description

Redeploy zkstack adapters.

## Watched changes

```diff
-   Status: DELETED
    contract ZkStack_Adapter (0x3155A91D2EBAe69443B45556e1DE5ed8eB79C90D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ZkStack_CustomGasToken_Adapter (0x54976794ef6b8d630F27c0F2cCB27bBcEf9aF9D0)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.232:
-        "0x54976794ef6b8d630F27c0F2cCB27bBcEf9aF9D0"
+        "0x63AC22131eD457aeCbD63e6c4C7eeC7BBC74fF1F"
      values.Adapters.324:
-        "0x3155A91D2EBAe69443B45556e1DE5ed8eB79C90D"
+        "0xA374585E6062517Ee367ee5044946A6fBe17724f"
    }
```

```diff
+   Status: CREATED
    contract ZkStack_CustomGasToken_Adapter (0x63AC22131eD457aeCbD63e6c4C7eeC7BBC74fF1F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkStack_Adapter (0xA374585E6062517Ee367ee5044946A6fBe17724f)
    +++ description: None
```

Generated with discovered.json: 0xcfeefe518ed2f5050a3169fbf01cd75af43c2632

# Diff at Mon, 31 Mar 2025 10:16:28 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@71ffebe835be10b6d5d09ef65aa19b910de8a2ec block: 22045124
- current block number: 22166242

## Description

Add a second adapter for zkstacks.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.232:
+        "0x54976794ef6b8d630F27c0F2cCB27bBcEf9aF9D0"
      values.CrossChainContracts.232:
+        "0xe7cb3e167e7475dE1331Cf6E0CEb187654619E12"
    }
```

```diff
+   Status: CREATED
    contract ZkStack_CustomGasToken_Adapter (0x54976794ef6b8d630F27c0F2cCB27bBcEf9aF9D0)
    +++ description: None
```

## Source code changes

```diff
.../.flat/ZkStack_CustomGasToken_Adapter.sol       | 625 +++++++++++++++++++++
 1 file changed, 625 insertions(+)
```

Generated with discovered.json: 0x0e07582d889b04364a1534217256640cf647864f

# Diff at Fri, 14 Mar 2025 12:33:51 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@a22da884d1a9470186e80799bc96392136af1fbe block: 21802758
- current block number: 22045124

## Description

ZkStack adapter added (replaces ZkSync adapter). Currently targeting the old shared bridge address.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.324:
-        "0xE233009838CB898b50e0012a6E783FC9FeE447FB"
+        "0x3155A91D2EBAe69443B45556e1DE5ed8eB79C90D"
    }
```

```diff
-   Status: DELETED
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkStack_Adapter (0x3155A91D2EBAe69443B45556e1DE5ed8eB79C90D)
    +++ description: None
```

## Source code changes

```diff
.../ZkStack_Adapter.sol}                           | 214 ++++++++++++---------
 1 file changed, 125 insertions(+), 89 deletions(-)
```

Generated with discovered.json: 0xc753ebcff88fc4ca6a584bd241359bf7e72ae340

# Diff at Tue, 04 Mar 2025 10:38:49 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@98d260b45fe0d2195ce5e629bd7b200c8706e8ba block: 21802758
- current block number: 21802758

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21802758 (main branch discovery), not current.

```diff
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) {
    +++ description: None
      sinceBlock:
+        20512287
    }
```

```diff
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828) {
    +++ description: None
      sinceBlock:
+        9247089
    }
```

```diff
    contract Soneium_Adapter (0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2) {
    +++ description: None
      sinceBlock:
+        21597341
    }
```

```diff
    contract Arbitrum_Adapter (0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210) {
    +++ description: None
      sinceBlock:
+        21237154
    }
```

```diff
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA) {
    +++ description: None
      sinceBlock:
+        20432774
    }
```

```diff
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) {
    +++ description: None
      sinceBlock:
+        14716798
    }
```

```diff
    contract AcrossConfigStore (0x3B03509645713718B78951126E0A6de6f10043f5) {
    +++ description: None
      sinceBlock:
+        14717196
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: None
      sinceBlock:
+        9247083
    }
```

```diff
    contract PolygonTokenBridger (0x48d990AbDA20afa1fD1da713AbC041B60a922c65) {
    +++ description: None
      sinceBlock:
+        14704448
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: None
      sinceBlock:
+        16697363
    }
```

```diff
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) {
    +++ description: None
      sinceBlock:
+        14704381
    }
```

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      sinceBlock:
+        17117454
    }
```

```diff
    contract Alephzero_Adapter (0x6F4083304C2cA99B077ACE06a5DcF670615915Af) {
    +++ description: None
      sinceBlock:
+        21131132
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: None
      sinceBlock:
+        16697276
    }
```

```diff
    contract LpTokenFactory (0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d) {
    +++ description: None
      sinceBlock:
+        14704307
    }
```

```diff
    contract Ink_Adapter (0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2) {
    +++ description: None
      sinceBlock:
+        21438590
    }
```

```diff
    contract Linea_Adapter (0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE) {
    +++ description: None
      sinceBlock:
+        19402413
    }
```

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      sinceBlock:
+        10688070
    }
```

```diff
    contract Lisk_Adapter (0x8229E812f20537caA1e8Fb41749b4887B8a75C3B) {
    +++ description: None
      sinceBlock:
+        20184545
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: None
      sinceBlock:
+        17176107
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: None
      sinceBlock:
+        16697394
    }
```

```diff
    contract WorldChain_Adapter (0xA8399e221a583A57F54Abb5bA22f31b5D6C09f32) {
    +++ description: None
      sinceBlock:
+        20963234
    }
```

```diff
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e) {
    +++ description: None
      sinceBlock:
+        19915066
    }
```

```diff
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      sinceBlock:
+        13559776
    }
```

```diff
    contract Scroll_Adapter (0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F) {
    +++ description: None
      sinceBlock:
+        20318360
    }
```

```diff
    contract CoveredCallFinancialProductLibrary (0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58) {
    +++ description: None
      sinceBlock:
+        12234012
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      sinceBlock:
+        14819537
    }
```

```diff
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c) {
    +++ description: None
      sinceBlock:
+        19915087
    }
```

```diff
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b) {
    +++ description: None
      sinceBlock:
+        19915034
    }
```

```diff
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB) {
    +++ description: None
      sinceBlock:
+        17842162
    }
```

```diff
    contract BondToken (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) {
    +++ description: None
      sinceBlock:
+        17980554
    }
```

```diff
    contract UMAOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24) {
    +++ description: None
      sinceBlock:
+        13545034
    }
```

```diff
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0) {
    +++ description: None
      sinceBlock:
+        19914094
    }
```

```diff
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81) {
    +++ description: None
      sinceBlock:
+        20221494
    }
```

```diff
    contract DoctorWho_Adapter (0xFADcC43096756e1527306FD92982FEbBe3c629Fa) {
    +++ description: None
      sinceBlock:
+        21773451
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: None
      sinceBlock:
+        16636058
    }
```

Generated with discovered.json: 0xc81c768c833157376bd8b452462bae64089944f3

# Diff at Sat, 08 Feb 2025 15:50:47 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@ef01ea79812e0d524af00be3fae1170cef6fd662 block: 21786466
- current block number: 21802758

## Description

Upgrade of the ethereum spoke pool: Refactor that mainly switches previous `address` types to `bytes32` and renames / merges some functions.

## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      sourceHashes.1:
-        "0xf5ec60450a251965f87d58578708ae6f3718afe7721e152b6983ca8d18ec3362"
+        "0x10d81ccfd26fbcb9926942a46436a7bedd3946646911a43f3f0e13dc7eb81517"
      values.$implementation:
-        "0xD576931ab0bDC3dfdc2c041d3C7b9d2ED0c6dd9a"
+        "0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a"
      values.$pastUpgrades.8:
+        ["2025-02-07T14:46:47.000Z","0xbea88935fe99b6faba60ee273a5eb146cd6c2d12decfef8842c5c719a0009376",["0x0190a2328e072Fc5a7fA00F6C9ae2a16c7F4E32a"]]
      values.$upgradeCount:
-        8
+        9
      values.EMPTY_RELAYER:
-        "0x0000000000000000000000000000000000000000"
+        "0x0000000000000000000000000000000000000000000000000000000000000000"
      values.UPDATE_V3_DEPOSIT_DETAILS_HASH:
-        "0x152eb71524aef34d838ab76573c14b1ebfa5e385d9ab29d7cf5398daa2438bd9"
      values.MAX_EXCLUSIVITY_PERIOD_SECONDS:
+        31536000
      values.UPDATE_ADDRESS_DEPOSIT_DETAILS_HASH:
+        "0x9c6dfd61d811b9950a4f2b9adf46357b717c816d22c420d0bde8f2360148f7cd"
      values.UPDATE_BYTES32_DEPOSIT_DETAILS_HASH:
+        "0x8d1994e2bbbd77564cdca06dd819e7ee2a5efa06c80dcb59a4a7b6e39edc538f"
    }
```

## Source code changes

```diff
.../Ethereum_SpokePool/Ethereum_SpokePool.sol      | 1128 +++++++++++++++-----
 1 file changed, 856 insertions(+), 272 deletions(-)
```

Generated with discovered.json: 0xc1e43b3b90793a3739173b71a2c7dce6122f42ca

# Diff at Thu, 06 Feb 2025 09:08:42 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@fa699ce266b15edb364aa471a661f580ea1a4529 block: 21736634
- current block number: 21786466

## Description

Adapter for Doctor Who (??) deployed, not yet in use.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.130:
+        "0xFADcC43096756e1527306FD92982FEbBe3c629Fa"
      values.CrossChainContracts.130:
+        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
    }
```

```diff
+   Status: CREATED
    contract DoctorWho_Adapter (0xFADcC43096756e1527306FD92982FEbBe3c629Fa)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/DoctorWho_Adapter.sol | 588 +++++++++++++++++++++
 1 file changed, 588 insertions(+)
```

Generated with discovered.json: 0xaa2d1977472327aec38f40d945810841efd7dcc8

# Diff at Thu, 30 Jan 2025 10:04:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@2da0612158e4fa23c41926c49e88a7b955a8c5dc block: 21628877
- current block number: 21736634

## Description

Minor upgrade to the Ethereum SpokePool, `hubPool` now called `withdrawalRecipient`.

## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      sourceHashes.1:
-        "0x7bae4a313d267e381b0aa01e463be4435e016d0c53c26b0f4136d4caa180fa88"
+        "0xf5ec60450a251965f87d58578708ae6f3718afe7721e152b6983ca8d18ec3362"
      values.$implementation:
-        "0x48Dcf75EA18233BA947E4480dCd70594720449C1"
+        "0xD576931ab0bDC3dfdc2c041d3C7b9d2ED0c6dd9a"
      values.$pastUpgrades.7:
+        ["2025-01-29T00:44:11.000Z","0x4d37ad20bb31cedba7434223e08229ca95fbfd32eaf2bcbd456af0d0a32bba8b",["0xD576931ab0bDC3dfdc2c041d3C7b9d2ED0c6dd9a"]]
      values.$upgradeCount:
-        7
+        8
      values.hubPool:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      values.withdrawalRecipient:
+        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
    }
```

## Source code changes

```diff
.../Ethereum_SpokePool/Ethereum_SpokePool.sol      | 249 ++++++++++-----------
 1 file changed, 118 insertions(+), 131 deletions(-)
```

Generated with discovered.json: 0x1608f8395ca3960349c8322a8a60274fdea21e37

# Diff at Mon, 20 Jan 2025 11:09:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@2c8b4f3d9910bb6371be9b4df87b70856e7d8c64 block: 21628877
- current block number: 21628877

## Description

Rerun on the same block number. Applies fixes to permissions and via field. Renames permission's target to to/from.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21628877 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      issuedPermissions.0.target:
-        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
      issuedPermissions.0.to:
+        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: None
      directlyReceivedPermissions.0.target:
-        "0xB524735356985D2f267FA010D681f061DfF03715"
      directlyReceivedPermissions.0.from:
+        "0xB524735356985D2f267FA010D681f061DfF03715"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      receivedPermissions.0.target:
-        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      receivedPermissions.0.from:
+        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
    }
```

Generated with discovered.json: 0x0f35b730661bd82dbea92413045a93d136735522

# Diff at Wed, 15 Jan 2025 09:06:12 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@3ea176aee1470e5ec80e65adfc81a954f84584d8 block: 21543430
- current block number: 21628877

## Description

Soneium adapter added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.1868:
+        "0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2"
      values.CrossChainContracts.1868:
+        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
    }
```

```diff
+   Status: CREATED
    contract Soneium_Adapter (0x0c9d064523177dBB55CFE52b9D0c485FBFc35FD2)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Soneium_Adapter.sol   | 596 +++++++++++++++++++++
 1 file changed, 596 insertions(+)
```

Generated with discovered.json: 0x4a75fdca8455fbd7d6fb3c4a66c4947552961416

# Diff at Fri, 03 Jan 2025 10:43:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f2f208ac8a91552305da5e03332108446838b892 block: 21388072
- current block number: 21543430

## Description

New Arbitrum_Adapter: No changes  except for comments.

New standard OP_Adapter for the Ink RU.

## Watched changes

```diff
-   Status: DELETED
    contract Arbitrum_Adapter (0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.42161:
-        "0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426"
+        "0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210"
      values.Adapters.57073:
+        "0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2"
      values.CrossChainContracts.57073:
+        "0xeF684C38F94F48775959ECf2012D7E864ffb9dd4"
    }
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0x100EDfCf3af2B4625Fca4EaF6C533703e71F7210)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ink_Adapter (0x7e90A40c7519b041A7DF6498fBf5662e8cFC61d2)
    +++ description: None
```

## Source code changes

```diff
.../{.flat@21388072 => .flat}/Arbitrum_Adapter.sol |  10 +
 .../across-v3/ethereum/.flat/Ink_Adapter.sol       | 596 +++++++++++++++++++++
 2 files changed, 606 insertions(+)
```

Generated with discovered.json: 0x5cf4cef23f0cb03295260afbe5b50fdd11ebf6d1

# Diff at Thu, 12 Dec 2024 17:59:11 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@fa5a98638066331a8ea6329a256a3462e7da2b3a block: 21142111
- current block number: 21388072

## Description

Ignored current time value.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21142111 (main branch discovery), not current.

```diff
    contract UMAOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24) {
    +++ description: None
      values.getCurrentTime:
-        1731059123
    }
```

Generated with discovered.json: 0x6e237fc3e7c6a0dfacdf8c3facadcfce1cd29744

# Diff at Tue, 10 Dec 2024 10:36:39 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@9ed5a41ddcad978cfdf826bc7a4827bf4a91c814 block: 21142111
- current block number: 21142111

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 21142111 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract AcrossConfigStore (0x3B03509645713718B78951126E0A6de6f10043f5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PolygonTokenBridger (0x48d990AbDA20afa1fD1da713AbC041B60a922c65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UMAOptimisticOracle (0xeE3Afe347D5C74317041E2618C49534dAf887c24)
    +++ description: None
```

Generated with discovered.json: 0x52dadfca973170d723ce40d572f31cce6594232a

# Diff at Fri, 08 Nov 2024 09:45:41 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@53988239f42edde0275ed92d8f3ada4279354f7d block: 20997757
- current block number: 21142111

## Description

Alephzero adapter added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.41455:
+        "0x6F4083304C2cA99B077ACE06a5DcF670615915Af"
      values.CrossChainContracts.41455:
+        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
    }
```

```diff
+   Status: CREATED
    contract Alephzero_Adapter (0x6F4083304C2cA99B077ACE06a5DcF670615915Af)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Alephzero_Adapter.sol | 711 +++++++++++++++++++++
 1 file changed, 711 insertions(+)
```

Generated with discovered.json: 0x06759bc3145293933667947d7cb0ef0a871d648b

# Diff at Mon, 21 Oct 2024 11:03:42 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@8895d33866f5665c4c710f4ddaa32bfa63cc3c78 block: 20997757
- current block number: 20997757

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20997757 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      values.$pastUpgrades.6.2:
+        ["0x48Dcf75EA18233BA947E4480dCd70594720449C1"]
      values.$pastUpgrades.6.1:
-        ["0x48Dcf75EA18233BA947E4480dCd70594720449C1"]
+        "0xd3cfc5a7476fd33d3d3fdc2d77adac2bf6900945f9a5c5f35f65b6507dde381f"
      values.$pastUpgrades.5.2:
+        ["0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"]
      values.$pastUpgrades.5.1:
-        ["0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"]
+        "0xa604480755748d8162a3fb11442719682d473d868450e7460d9dd111a0b8903a"
      values.$pastUpgrades.4.2:
+        ["0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"]
      values.$pastUpgrades.4.1:
-        ["0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"]
+        "0x3ebfeeedb62ab726a1cb350595df3d4b2212f2fda619ae08015d16f304fc8332"
      values.$pastUpgrades.3.2:
+        ["0x90438AD3d81a0739ce1Cb20C73564682388c5FdD"]
      values.$pastUpgrades.3.1:
-        ["0x90438AD3d81a0739ce1Cb20C73564682388c5FdD"]
+        "0xf08778addb8376b0beb500bf569c6251eadc124e6aeeaf5f702ab1dbf576379f"
      values.$pastUpgrades.2.2:
+        ["0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"]
      values.$pastUpgrades.2.1:
-        ["0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"]
+        "0x946dec56639129cadd298ce5a44341b6f361c5c632f5dea2a80d9cb023b836c6"
      values.$pastUpgrades.1.2:
+        ["0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"]
      values.$pastUpgrades.1.1:
-        ["0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"]
+        "0xceb5b11cd6c78b29d16d2c91bedcb4ec7467814fdce84a753f468c452c36c0d6"
      values.$pastUpgrades.0.2:
+        ["0xA667498F46457548f1D3ad557340b95Fdb290148"]
      values.$pastUpgrades.0.1:
-        ["0xA667498F46457548f1D3ad557340b95Fdb290148"]
+        "0x411ae8360c51beff3d6034ea63f03c41e6cf8b031432391fc44bc4f5a1b908ef"
    }
```

Generated with discovered.json: 0x6d36103492d2f52e6253b8f9e2d07b73b4c8b5e5

# Diff at Sat, 19 Oct 2024 06:15:10 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@493c96785a6a32c6417182bb9548d3a990297dbe block: 20934032
- current block number: 20997757

## Description

Minor upgrade of the WorldChain Adapter to support their custom USDC escrow.

## Watched changes

```diff
-   Status: DELETED
    contract WorldChain_Adapter (0x8eBebfc894047bEE213A561b8792fCa71241731f)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.480:
-        "0x8eBebfc894047bEE213A561b8792fCa71241731f"
+        "0xA8399e221a583A57F54Abb5bA22f31b5D6C09f32"
    }
```

```diff
+   Status: CREATED
    contract WorldChain_Adapter (0xA8399e221a583A57F54Abb5bA22f31b5D6C09f32)
    +++ description: None
```

## Source code changes

```diff
.../WorldChain_Adapter.sol                         | 25 +++++++++++++---------
 1 file changed, 15 insertions(+), 10 deletions(-)
```

Generated with discovered.json: 0xd7ff53370050b4046ea7e36258229abf1541932b

# Diff at Fri, 18 Oct 2024 10:53:31 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@0295165a89d86b7450439f24f100d1baa74381fc block: 20934032
- current block number: 20934032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20934032 (main branch discovery), not current.

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: None
      directlyReceivedPermissions:
+        [{"permission":"act","target":"0xB524735356985D2f267FA010D681f061DfF03715"}]
    }
```

Generated with discovered.json: 0xd724021c94c1d6affef9e3b5adf59952c248f1fb

# Diff at Mon, 14 Oct 2024 10:48:32 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1afc77ff111ceb0970e7d09efcc7b2f376b0c281 block: 20934032
- current block number: 20934032

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20934032 (main branch discovery), not current.

```diff
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b) {
    +++ description: None
      sourceHashes:
+        ["0x6d9e4b79712a4e81c51941fb986f4c55774da36be108106577ca01ccb35a0f87"]
    }
```

```diff
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828) {
    +++ description: None
      sourceHashes:
+        ["0x349b0f612f02a8599667c43efe1e547bf4f18a46732001b3afb6b425a87325e9"]
    }
```

```diff
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA) {
    +++ description: None
      sourceHashes:
+        ["0x0c32a0cfde3cb87843b5521bf184be1dd2b0031a8e91c2bc7885a2e10db010c1"]
    }
```

```diff
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3) {
    +++ description: None
      sourceHashes:
+        ["0x9f8b082009430546d55daaa8e166eca77ef9ca17f7831f03de4635bdc4a32b31"]
    }
```

```diff
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3) {
    +++ description: None
      sourceHashes:
+        ["0x6b81a32a0de6b3e8ed743f089a6518d3791b0e4d373300269439642482338ddb"]
    }
```

```diff
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC) {
    +++ description: None
      sourceHashes:
+        ["0x28c93f7b68e31548857633c6cb61284d9d2860cc0fbbcaaede8f631d364d66a4"]
    }
```

```diff
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084) {
    +++ description: None
      sourceHashes:
+        ["0x14afbe84cefefdcb06132c680d267b8892f0834a39fc23ca0ea563758653a21a"]
    }
```

```diff
    contract Arbitrum_Adapter (0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426) {
    +++ description: None
      sourceHashes:
+        ["0xa1c171564a6e837069132a07b8c6d217e08cf53cd6a43151a7f497440d2f1e33"]
    }
```

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      sourceHashes:
+        ["0x669da4e91a9ad0ca23205a174e7f8931e4d7d128453132164ba6458f11f15c72","0x7bae4a313d267e381b0aa01e463be4435e016d0c53c26b0f4136d4caa180fa88"]
    }
```

```diff
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8) {
    +++ description: None
      sourceHashes:
+        ["0xdf7f17e5c8ba1f0103fcfaf495da624089f8bfb3d5052217537bb064ca8c60b9"]
    }
```

```diff
    contract LpTokenFactory (0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d) {
    +++ description: None
      sourceHashes:
+        ["0x54ab5e1f981929fca37e28c313db9ab35343de3df6907dbaeb29dda3840aadcd"]
    }
```

```diff
    contract Linea_Adapter (0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE) {
    +++ description: None
      sourceHashes:
+        ["0x6cc7cfdaa6b4d79d35a624dafc13713137f61d46c6536a4837a2793c3fa3fc4d"]
    }
```

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      sourceHashes:
+        ["0xd5a33441170541b7df25812e0e3dff6562b2f09ab835a6b431cb9e7198a47605","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Lisk_Adapter (0x8229E812f20537caA1e8Fb41749b4887B8a75C3B) {
    +++ description: None
      sourceHashes:
+        ["0x4d929bc632eff7818792b2ad5539b8b5dbc8842e7d23c9d9bfb116acb05eb96a"]
    }
```

```diff
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991) {
    +++ description: None
      sourceHashes:
+        ["0xcecd27c998c8fd83d7532693da2bdff346a1dbedbaab4744f21d2bcf1986e9de"]
    }
```

```diff
    contract WorldChain_Adapter (0x8eBebfc894047bEE213A561b8792fCa71241731f) {
    +++ description: None
      sourceHashes:
+        ["0xa2716832109570351047beb288a3a96a17d443cc548980a1327bb59729b74efe"]
    }
```

```diff
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748) {
    +++ description: None
      sourceHashes:
+        ["0x435ceb597bcf7bd820f593bdbc0e3ce4d223cc2203b368911d2b29fa6bc5e048"]
    }
```

```diff
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e) {
    +++ description: None
      sourceHashes:
+        ["0xf598be4ed345b6b3e83e04dff2cb5472dc4df0b8476f8f74a4c75c473dee6347"]
    }
```

```diff
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      sourceHashes:
+        ["0x81a7349eebb98ac33b0bc6842e3cb258034a8f2a4ba004570bb8e2e25947f9ff","0xd42bbf9f7dcd3720a7fc6bdc6edfdfae8800a37d6dd4decfa0ef6ca4a2e88940"]
    }
```

```diff
    contract Scroll_Adapter (0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F) {
    +++ description: None
      sourceHashes:
+        ["0x56586e3315f76ed277970410b47da25a0980ca9400f2a97fd38139e2a1f2dc5e"]
    }
```

```diff
    contract CoveredCallFinancialProductLibrary (0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58) {
    +++ description: None
      sourceHashes:
+        ["0x626fc280735c432e9187554bc59d556389dc73435f1b570e64f424d257f68d09"]
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      sourceHashes:
+        ["0x3afa0a01f4cde6c678d6ec12443078407e69293b9a4519105445f694671b2dec"]
    }
```

```diff
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c) {
    +++ description: None
      sourceHashes:
+        ["0x172a1f27f0fecf665d90a6adc1287223f05a73acd9ed19d9c446972880ccce0f"]
    }
```

```diff
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b) {
    +++ description: None
      sourceHashes:
+        ["0x59784b70d01278196c00fbfe1f237b01ec891dca28b0542cdf8dcc9e672b3849"]
    }
```

```diff
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB) {
    +++ description: None
      sourceHashes:
+        ["0xc4f838b87ec9ed41b647f7d3a4a508abdb28aef5a4908a9e0829ccb37f319cc8"]
    }
```

```diff
    contract BondToken (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea) {
    +++ description: None
      sourceHashes:
+        ["0x1d9754ae4e99e4320201bbc6f0e19aa5ecac917dcacaadba3b70cfa018910754"]
    }
```

```diff
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0) {
    +++ description: None
      sourceHashes:
+        ["0x1b1b271fd3f736024fda7dd869d78943819efee5dcbf6f4075af9647cfb16cac"]
    }
```

```diff
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81) {
    +++ description: None
      sourceHashes:
+        ["0x596bdc0b39f0ff19cde625424cdc037dd3e79355ee2c845bd8a6e5e42b3bc332"]
    }
```

```diff
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE) {
    +++ description: None
      sourceHashes:
+        ["0xfb2c9056673690384bb615fd326655f97b80fa2a5601a15a35065b0a68186ae7"]
    }
```

Generated with discovered.json: 0x38aad1481151a89c2ea4d20c9aef1cf3d10e0e3d

# Diff at Thu, 10 Oct 2024 08:32:18 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@cb5ff535ffc194baf7396bd6db8232883e2ad088 block: 20675639
- current block number: 20934032

## Description

New Hub added (Worldchain).

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.480:
+        "0x8eBebfc894047bEE213A561b8792fCa71241731f"
      values.CrossChainContracts.480:
+        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
    }
```

```diff
+   Status: CREATED
    contract WorldChain_Adapter (0x8eBebfc894047bEE213A561b8792fCa71241731f)
    +++ description: None
```

## Source code changes

```diff
.../ethereum/.flat/WorldChain_Adapter.sol          | 591 +++++++++++++++++++++
 1 file changed, 591 insertions(+)
```

Generated with discovered.json: 0xfd768f13b611e4a0af3411019ac6f2f75bea7357

# Diff at Tue, 01 Oct 2024 10:49:24 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@bd754dc73c66120164006054f8d25c5fae9cd910 block: 20675639
- current block number: 20675639

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20675639 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      values.$pastUpgrades:
+        [["2023-04-24T16:52:35.000Z",["0xA667498F46457548f1D3ad557340b95Fdb290148"]],["2023-08-22T00:20:59.000Z",["0x326510c1bf9d85Fb73d0AB8d20Aa5BbE9c7561e9"]],["2023-10-03T13:48:47.000Z",["0x5ab0A812327aD959dE664AEC8408Ef8c6ABe7184"]],["2024-02-21T18:04:23.000Z",["0x90438AD3d81a0739ce1Cb20C73564682388c5FdD"]],["2024-03-18T13:40:47.000Z",["0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"]],["2024-05-15T15:11:59.000Z",["0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"]],["2024-09-03T15:48:23.000Z",["0x48Dcf75EA18233BA947E4480dCd70594720449C1"]]]
    }
```

Generated with discovered.json: 0x2a73e7d79017ef77856103254e8631297be55635

# Diff at Wed, 04 Sep 2024 07:12:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@878a951312cec062f5003f6749f781861b0cdba1 block: 20532552
- current block number: 20675639

## Description

Small implementation upgrade of the Ethereum Spoke Pool:
* depositExclusive(): Public method that allows users to set an exclusive relayer for their deposit for a certain time. (Any relayer can fulfill the request at the destination after `exclusivityDeadlineOffset` passes)

## Watched changes

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      values.$implementation:
-        "0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
+        "0x48Dcf75EA18233BA947E4480dCd70594720449C1"
      values.$upgradeCount:
-        6
+        7
    }
```

## Source code changes

```diff
.../Ethereum_SpokePool/Ethereum_SpokePool.sol      | 95 +++++++++++++++++++++-
 1 file changed, 93 insertions(+), 2 deletions(-)
```

Generated with discovered.json: 0x5505aceb59200d22be98a33c394b380e7a23c7cf

# Diff at Fri, 30 Aug 2024 07:50:52 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@6c1bd1f41fadf5f2cb1c1805b5a2c6138a3ed35a block: 20532552
- current block number: 20532552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532552 (main branch discovery), not current.

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      receivedPermissions.0.via:
-        []
    }
```

Generated with discovered.json: 0x8e35f31d9d10c1b7228c85a0ffc973980ed619c0

# Diff at Fri, 23 Aug 2024 09:50:52 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@67597c7d6c810bc726594446890178150240711e block: 20532552
- current block number: 20532552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532552 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      values.$upgradeCount:
+        6
    }
```

Generated with discovered.json: 0x25083660ffed581d9a0044fec9d4ec63fdf6a3d8

# Diff at Wed, 21 Aug 2024 10:01:38 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@2f6dde3357bf5d79196b6e94f79d853a6c4ec72b block: 20532552
- current block number: 20532552

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20532552 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      issuedPermissions:
+        [{"permission":"upgrade","target":"0xc186fA914353c44b2E33eBE05f21846F1048bEda","via":[]}]
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      assignedPermissions:
-        {"upgrade":["0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"]}
      receivedPermissions:
+        [{"permission":"upgrade","target":"0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5","via":[]}]
    }
```

Generated with discovered.json: 0xf27ee85934c0dc2fbfecd1d1d8da4503777c5497

# Diff at Thu, 15 Aug 2024 07:31:34 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@9a07aead4b3726cc622f66fe9a15e06e63af7acd block: 20518997
- current block number: 20532552

## Description

New adapter and L2 crosschain target for Zora were added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.7777777:
+        "0x024F2fC31CBDD8de17194b1892c834f98Ef5169b"
      values.CrossChainContracts.7777777:
+        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
    }
```

```diff
+   Status: CREATED
    contract Zora_Adapter (0x024F2fC31CBDD8de17194b1892c834f98Ef5169b)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Zora_Adapter.sol      | 590 +++++++++++++++++++++
 1 file changed, 590 insertions(+)
```

Generated with discovered.json: 0xe9a9d7fdf87c58268c0949602f8942688583b6ab

# Diff at Tue, 13 Aug 2024 10:06:57 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@8b923f6edf399d43a5cd7f331708956dce3e83d1 block: 20482283
- current block number: 20518997

## Description

The Spoke pool (used for liquidity on the destination chains) was changed for the Redstone Adapter.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.690:
-        "0x28077B47Cd03326De7838926A63699849DD4fa87"
+        "0x13fDac9F9b4777705db45291bbFF3c972c6d1d97"
    }
```

Generated with discovered.json: 0x268645e90c13973d8d0e1a6b1dd839737c270f02

# Diff at Fri, 09 Aug 2024 10:08:18 GMT:

- author: Mateusz Radomski (<radomski.main@protonmail.com>)
- comparing to: main@1f0da1d0aab7bc6b3b5e54e7e93480bd98e57035 block: 20482283
- current block number: 20482283

## Description

Discovery rerun on the same block number with only config-related changes.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20482283 (main branch discovery), not current.

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      values.$multisigThreshold:
-        "2 of 4 (50%)"
      values.getOwners:
-        ["0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"]
      values.getThreshold:
-        2
      values.$members:
+        ["0x363605C0bdE9F1F5053aDA30618d95dbFc109Bf5","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe"]
      values.$threshold:
+        2
      values.multisigThreshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      values.$multisigThreshold:
-        "3 of 5 (60%)"
      values.getOwners:
-        ["0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe","0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x868CF19464e17F76D6419ACC802B122c22D2FD34"]
      values.getThreshold:
-        3
      values.$members:
+        ["0x1d933Fd71FF07E69f066d50B39a7C34EB3b69F05","0x837219D7a9C666F5542c4559Bf17D7B804E5c5fe","0x996267d7d1B7f5046543feDe2c2Db473Ed4f65e9","0xcc400c09ecBAC3e0033e4587BdFAABB26223e37d","0x868CF19464e17F76D6419ACC802B122c22D2FD34"]
      values.$threshold:
+        3
      values.multisigThreshold:
+        "3 of 5 (60%)"
    }
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      assignedPermissions.admin:
-        ["0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"]
      assignedPermissions.upgrade:
+        ["0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"]
    }
```

Generated with discovered.json: 0x694b66df3231b8a4fe6cb923963e8254b05ba3e1

# Diff at Thu, 08 Aug 2024 07:11:14 GMT:

- author: Radina Talanova (<nt.radina@gmail.com>)
- comparing to: main@5a17db968badca34a66703637dabf76a313bb43e block: 20389580
- current block number: 20482283

## Description

A new Adapter and L2 crosschain target for Redstone are added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.690:
+        "0x188F8C95B7cfB7993B53a4F643efa687916f73fA"
      values.CrossChainContracts.690:
+        "0x28077B47Cd03326De7838926A63699849DD4fa87"
    }
```

```diff
+   Status: CREATED
    contract Redstone_Adapter (0x188F8C95B7cfB7993B53a4F643efa687916f73fA)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Redstone_Adapter.sol  | 590 +++++++++++++++++++++
 1 file changed, 590 insertions(+)
```

Generated with discovered.json: 0xdbd5447e307a5f0e39981d7b5ea954532dc92555

# Diff at Fri, 26 Jul 2024 08:38:43 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@f98f9bf0ba32e20ec33942af664ae6ed27e8172d block: 20289714
- current block number: 20389580

## Description

A new Adapter and L2 crosschain target for Scroll is registered.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.534352:
+        "0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F"
      values.CrossChainContracts.534352:
+        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
    }
```

```diff
+   Status: CREATED
    contract Scroll_Adapter (0xb6129Ab69aEA75e6884c2D6ecf25293C343C519F)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Scroll_Adapter.sol    | 531 +++++++++++++++++++++
 1 file changed, 531 insertions(+)
```

Generated with discovered.json: 0x5bed7c1b5746cf1f6518eef6a73859844d4d86c8

# Diff at Fri, 12 Jul 2024 10:06:36 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@48ec906f1df3ec8351c0e2324170592091f7c1db block: 20232297
- current block number: 20289714

## Description

An adapter for Blast L2 is added.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.81457:
+        "0xF2bEf5E905AAE0295003ab14872F811E914EdD81"
      values.CrossChainContracts.81457:
+        "0x2D509190Ed0172ba588407D4c2df918F955Cc6E1"
    }
```

```diff
+   Status: CREATED
    contract Blast_Adapter (0xF2bEf5E905AAE0295003ab14872F811E914EdD81)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Blast_Adapter.sol     | 601 +++++++++++++++++++++
 1 file changed, 601 insertions(+)
```

Generated with discovered.json: 0xe1c37ec100450be1198b8b4a281461e96e22f4fe

# Diff at Thu, 04 Jul 2024 09:37:01 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- comparing to: main@bfc05c606d82c4a38bb3b8c60569f0c976d7ba3a block: 20204613
- current block number: 20232297

## Description

A new adapter for Lisk is registered. Other changes are config related.

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.Adapters.1135:
+        "0x8229E812f20537caA1e8Fb41749b4887B8a75C3B"
      values.CrossChainContracts.1135:
+        "0x9552a0a6624A23B848060AE5901659CDDa1f83f8"
    }
```

```diff
+   Status: CREATED
    contract Lisk_Adapter (0x8229E812f20537caA1e8Fb41749b4887B8a75C3B)
    +++ description: None
```

## Source code changes

```diff
.../across-v3/ethereum/.flat/Lisk_Adapter.sol      | 590 +++++++++++++++++++++
 1 file changed, 590 insertions(+)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 20204613 (main branch discovery), not current.

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.1:
-        {"l2ChainId":1,"adapter":"0x527E872a5c3f0C7c24Fe33F2593cFB890a285084","spokePool":"0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"}
+        "0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5"
      values.CrossChainContracts.10:
-        {"l2ChainId":10,"adapter":"0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b","spokePool":"0x6f26Bf09B1C792e3228e5467807a900A503c0281"}
+        "0x6f26Bf09B1C792e3228e5467807a900A503c0281"
      values.CrossChainContracts.137:
-        {"l2ChainId":137,"adapter":"0xb4AeF0178f5725392A26eE18684C2aB62adc912e","spokePool":"0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"}
+        "0x9295ee1d8C5b022Be115A2AD3c30C72E34e7F096"
      values.CrossChainContracts.288:
-        {"l2ChainId":288,"adapter":"0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3","spokePool":"0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"}
+        "0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58"
      values.CrossChainContracts.324:
-        {"l2ChainId":324,"adapter":"0xE233009838CB898b50e0012a6E783FC9FeE447FB","spokePool":"0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"}
+        "0xE0B015E54d54fc84a6cB9B666099c46adE9335FF"
      values.CrossChainContracts.8453:
-        {"l2ChainId":8453,"adapter":"0xE1421233BF7158A19f89F17c9735F9cbd3D9529c","spokePool":"0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"}
+        "0x09aea4b2242abC8bb4BB78D537A67a245A7bEC64"
      values.CrossChainContracts.34443:
-        {"l2ChainId":34443,"adapter":"0xf1B59868697f3925b72889ede818B9E7ba0316d0","spokePool":"0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"}
+        "0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"
      values.CrossChainContracts.42161:
-        {"l2ChainId":42161,"adapter":"0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426","spokePool":"0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"}
+        "0xe35e9842fceaCA96570B734083f4a58e8F7C5f2A"
      values.CrossChainContracts.59144:
-        {"l2ChainId":59144,"adapter":"0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE","spokePool":"0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"}
+        "0x7E63A5f1a8F0B4d0934B2f2327DAED3F6bb2ee75"
      values.Adapters:
+        {"1":"0x527E872a5c3f0C7c24Fe33F2593cFB890a285084","10":"0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b","137":"0xb4AeF0178f5725392A26eE18684C2aB62adc912e","288":"0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3","324":"0xE233009838CB898b50e0012a6E783FC9FeE447FB","8453":"0xE1421233BF7158A19f89F17c9735F9cbd3D9529c","34443":"0xf1B59868697f3925b72889ede818B9E7ba0316d0","42161":"0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426","59144":"0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE"}
    }
```

Generated with discovered.json: 0x44dcb247700d419ff4f0fe12d00a6c356c1963ba

# Diff at Sun, 30 Jun 2024 12:51:10 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@60708cb34918009c7ee36a463625bddd2353d3c5 block: 19976242
- current block number: 20204613

## Description

Added ZkSync_Adapter.getL1CallValue to "ignoreMethods" because it is dependent
on tx.gasprice and returns different results event for the same block number
(e.g. when call is batched).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19976242 (main branch discovery), not current.

```diff
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB) {
    +++ description: None
      values.getL1CallValue:
-        500000000000000
    }
```

Generated with discovered.json: 0x4d7efdd31fe5b56bea03552b2c01f60249641603

# Diff at Wed, 29 May 2024 14:54:44 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@d0877009edde2713b2b4f20a593b40156f5de045 block: 19926192
- current block number: 19976242

## Description

Config related: Owner is upgrade admin.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19926192 (main branch discovery), not current.

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      upgradeability.admin:
-        "0x0000000000000000000000000000000000000000"
+        "0xc186fA914353c44b2E33eBE05f21846F1048bEda"
    }
```

Generated with discovered.json: 0x00e7d86c9c32ebac36ad2111ea5369e41a1d7770

# Diff at Wed, 22 May 2024 15:04:33 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@50042c8a4f2960931acbddbdf0949924bc003bcb block: 19891034
- current block number: 19926192

## Description

Added Mode adapter.
Changes to Polygon, Arbitrum, Optimism, Base adapters. 
    -  Added check for maximum burn amount for token per message on CCTP adapter. If the token amount to send exceeds the burn limit per message, then it will split the message into smaller parts.
New adapters implementation addresses broke config ignoreRelatives mapping, fixed now.


## Watched changes

```diff
-   Status: DELETED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressResolver (0x823bE81bbF96BEc0e25CA13170F5AaCb5B79ba83)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FiatTokenV2_2 (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Polygon_Adapter (0xB130E3056D5C692300d66c12C10ffA2073d9424D)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Optimism_Adapter (0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee)
    +++ description: None
```

```diff
-   Status: DELETED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.10.adapter:
-        "0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee"
+        "0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b"
      values.CrossChainContracts.137.adapter:
-        "0xB130E3056D5C692300d66c12C10ffA2073d9424D"
+        "0xb4AeF0178f5725392A26eE18684C2aB62adc912e"
      values.CrossChainContracts.8453.adapter:
-        "0xD9948AE3405FE03A52A18F119EF72221DCdCc4df"
+        "0xE1421233BF7158A19f89F17c9735F9cbd3D9529c"
      values.CrossChainContracts.42161.adapter:
-        "0xd881A21F17B83AefFd11cc2e7363740449eb8069"
+        "0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426"
      values.CrossChainContracts.34443:
+        {"l2ChainId":34443,"adapter":"0xf1B59868697f3925b72889ede818B9E7ba0316d0","spokePool":"0x3baD7AD0728f9917d1Bf08af5782dCbD516cDd96"}
    }
```

```diff
-   Status: DELETED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Adapter (0xd881A21F17B83AefFd11cc2e7363740449eb8069)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Base_Adapter (0xD9948AE3405FE03A52A18F119EF72221DCdCc4df)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MasterMinter (0xE982615d461DD5cD06575BbeA87624fda4e3de17)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0x5473CBD30bEd1Bf97C0c9d7c59d268CD620dA426)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0xb4AeF0178f5725392A26eE18684C2aB62adc912e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Base_Adapter (0xE1421233BF7158A19f89F17c9735F9cbd3D9529c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (0xE1e74B3D6A8E2A479B62958D4E4E6eEaea5B612b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Mode_Adapter (0xf1B59868697f3925b72889ede818B9E7ba0316d0)
    +++ description: None
```

## Source code changes

```diff
.../.flat@19891034/AddressManager.sol => /dev/null |  128 -
 .../AddressResolver.sol => /dev/null               |  102 -
 .../{.flat@19891034 => .flat}/Arbitrum_Adapter.sol |   13 +-
 .../Arbitrum_Bridge/Bridge.sol => /dev/null        |  664 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../{.flat@19891034 => .flat}/Base_Adapter.sol     |   13 +-
 .../ethereum/.flat@19891034/Dai.sol => /dev/null   |  153 -
 .../DepositManager/DepositManager.sol => /dev/null |  473 ---
 .../DepositManagerProxy.p.sol => /dev/null         |  220 --
 .../ERC20Predicate/ERC20Predicate.sol => /dev/null | 1137 -------
 .../ERC20PredicateProxy.p.sol => /dev/null         |  151 -
 .../EmergencyProposalExecutor}/GnosisSafe.sol      |    0
 .../EmergencyProposalExecutor}/Proxy.p.sol         |    0
 .../FiatTokenProxy.p.sol => /dev/null              |  267 --
 .../FiatTokenV2_2/FiatTokenV2_2.sol => /dev/null   | 2356 --------------
 .../.flat@19891034/FxRoot.sol => /dev/null         |   24 -
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../Governance/Governance.sol => /dev/null         |   83 -
 .../Governance/GovernanceProxy.p.sol => /dev/null  |  156 -
 .../.flat@19891034/Inbox/Inbox.sol => /dev/null    | 1181 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1CrossDomainMessenger.sol => /dev/null        | 1513 ---------
 .../Lib_ResolvedDelegateProxy.p.sol => /dev/null   |   67 -
 .../L1CrossDomainMessenger.sol => /dev/null        | 1727 ----------
 .../ResolvedDelegateProxy.p.sol => /dev/null       |   54 -
 .../L1DAITokenBridge.sol => /dev/null              |  482 ---
 .../L1ERC20Gateway/L1ERC20Gateway.sol => /dev/null | 1381 --------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../.flat@19891034/L1Escrow.sol => /dev/null       |   39 -
 .../L1GatewayRouter.sol => /dev/null               |  991 ------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1ChugSplashProxy.p.sol => /dev/null           |  268 --
 .../L1StandardBridge.sol => /dev/null              | 1586 ---------
 .../L1ChugSplashProxy.p.sol => /dev/null           |  343 --
 .../L1StandardBridge.sol => /dev/null              | 1537 ---------
 .../Lib_AddressManager.sol => /dev/null            |  151 -
 .../.flat@19891034/MasterMinter.sol => /dev/null   |  371 ---
 .../.flat@19891034/MaticToken.sol => /dev/null     |  438 ---
 .../.flat@19891034/MaticWETH.sol => /dev/null      |  289 --
 .../MerklePatriciaProof.sol => /dev/null           |  413 ---
 .../MessageTransmitter.sol => /dev/null            | 3080 ------------------
 .../across-v3/ethereum/.flat/Mode_Adapter.sol      |  578 ++++
 .../OptimismPortal.sol => /dev/null                | 3425 --------------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../OptimismPortal.sol => /dev/null                | 2881 ----------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../{.flat@19891034 => .flat}/Optimism_Adapter.sol |   13 +-
 .../{.flat@19891034 => .flat}/Polygon_Adapter.sol  |   13 +-
 .../dev/null                                       |  297 --
 .../dev/null                                       |  297 --
 .../dev/null                                       |  139 -
 .../dev/null                                       |  131 -
 .../.flat@19891034/ProxyERC20.sol => /dev/null     |  305 --
 .../.flat@19891034/ReadProxy.sol => /dev/null      |   62 -
 .../.flat@19891034/Registry.sol => /dev/null       |  150 -
 .../RootChain/RootChain.sol => /dev/null           |  608 ----
 .../RootChain/RootChainProxy.p.sol => /dev/null    |  193 --
 .../RootChainManager.sol => /dev/null              | 2087 ------------
 .../RootChainManagerProxy.p.sol => /dev/null       |  151 -
 .../SequencerInbox/SequencerInbox.sol => /dev/null | 1086 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../.flat@19891034/StateSender.sol => /dev/null    |  178 -
 .../SuperchainConfig/Proxy.p.sol => /dev/null      |  199 --
 .../SuperchainConfig.sol => /dev/null              |  476 ---
 .../.flat@19891034/Synthetix.sol => /dev/null      | 1662 ----------
 .../SynthetixBridgeToOptimism.sol => /dev/null     | 1284 --------
 .../.flat@19891034/Timelock.sol => /dev/null       |  675 ----
 .../.flat@19891034/TokenMessenger.sol => /dev/null | 2591 ---------------
 .../.flat@19891034/TokenMinter.sol => /dev/null    | 1270 --------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  630 ----
 .../UpgradeExecutor.sol => /dev/null               |  995 ------
 .../.flat@19891034/ValidatorShare.sol => /dev/null |  802 -----
 .../ethereum/.flat@19891034/WETH9.sol => /dev/null |   62 -
 .../WithdrawManager.sol => /dev/null               | 1267 --------
 .../WithdrawManagerProxy.p.sol => /dev/null        |  222 --
 76 files changed, 622 insertions(+), 49946 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19891034 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MessageTransmitter (0x0a992d191DEeC32aFe36203Ad87D7d289a738F81)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressResolver (0x823bE81bbF96BEc0e25CA13170F5AaCb5B79ba83)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FiatTokenV2_2 (0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMessenger (0xBd3fa81B58Ba92a82136038B25aDec7066af3155)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenMinter (0xc4922d64a24675E16e1586e3e3Aa56C06fABe907)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MasterMinter (0xE982615d461DD5cD06575BbeA87624fda4e3de17)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

Generated with discovered.json: 0x55d0510f7032eff3f615bdae368015f76f42ff06

# Diff at Fri, 17 May 2024 16:59:08 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- comparing to: main@7634eb7892129fd76fa0bce18d68181ba69b99db block: 19718050
- current block number: 19891034

## Description

Ethereum_SpokePool.sol
- Added events FundsDeposited, RequestedSpeedUpDeposit, FilledRelay

HubPool changes: added CircleCCTPAdapter. 
- The Cross-Chain Transfer Protocol (CCTP) is now used to bridge USDC on Arbitrum, Base, Optimism, and Polygon. 
- Change of adapters interface format (e.g., messenger -> MESSENGER, l1Weth -> L1_WETH) that impacted ignoreRelatives discovery. Now restored to ignore relatives of updated methods. 
Impacted adapters contracts: Arbitrum_Adapter.sol, Base_Adapter.sol, Optimism_Adapter.sol, Polygon_Adapter.sol.

## Watched changes

```diff
-   Status: DELETED
    contract  (0x01F645DcD6C796F6BC6C982159B32fAaaebdC96A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0x10A5F7D9D65bCc2734763444D4940a31b109275f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Adapter (0x29528780E29abb8Af95a5e5a125b94766987543F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Base_Adapter (0x2d8B1e2B0Dff62DF132d23BEa68a6D2c4D20046E)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Polygon_Adapter (0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
-   Status: DELETED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5) {
    +++ description: None
      upgradeability.implementation:
-        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
+        "0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
      implementations.0:
-        "0xa4D3535f33549749Fb97fA42903AC80F6fb54af6"
+        "0x08C21b200eD06D2e32cEC91a770C3FcA8aD5F877"
      values.fillDeadlineBuffer:
-        28800
+        21600
    }
```

```diff
-   Status: DELETED
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
-   Status: DELETED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
-   Status: DELETED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
-   Status: DELETED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xa8E31E3C38aDD6052A9407298FAEB8fD393A6cF9)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Optimism_Adapter (0xAd1b0a86c98703fd5F4E56fff04F6b2D9b9f246F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.CrossChainContracts.10.adapter:
-        "0xAd1b0a86c98703fd5F4E56fff04F6b2D9b9f246F"
+        "0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee"
      values.CrossChainContracts.137.adapter:
-        "0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A"
+        "0xB130E3056D5C692300d66c12C10ffA2073d9424D"
      values.CrossChainContracts.8453.adapter:
-        "0x2d8B1e2B0Dff62DF132d23BEa68a6D2c4D20046E"
+        "0xD9948AE3405FE03A52A18F119EF72221DCdCc4df"
      values.CrossChainContracts.42161.adapter:
-        "0x29528780E29abb8Af95a5e5a125b94766987543F"
+        "0xd881A21F17B83AefFd11cc2e7363740449eb8069"
    }
```

```diff
-   Status: DELETED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Whitelist (0xD485e5c28AA4985b23f6DF13dA03caa766dcd459)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xdc883b9d9Ee16f74bE08826E68dF4C9D9d26e8bD)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xE1cc2332852B2Ac0dA59A1f9D3051829f4eF3c1C)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiCollateralSynth (0xfb020CA7f4e8C4a5bBBe060f59a249c6275d2b69)
    +++ description: None
```

```diff
-   Status: DELETED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0xB130E3056D5C692300d66c12C10ffA2073d9424D)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (0xb3a4e39F0CD9aBAc5d866f023C18e73224667Fee)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0xd881A21F17B83AefFd11cc2e7363740449eb8069)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Base_Adapter (0xD9948AE3405FE03A52A18F119EF72221DCdCc4df)
    +++ description: None
```

## Source code changes

```diff
.../.flat@19718050/AddressManager.sol => /dev/null |  128 -
 .../{.flat@19718050 => .flat}/Arbitrum_Adapter.sol |  405 ++-
 .../Arbitrum_Bridge/Bridge.sol => /dev/null        |  664 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../{.flat@19718050 => .flat}/Base_Adapter.sol     |  139 +-
 .../ethereum/.flat@19718050/Dai.sol => /dev/null   |  153 -
 .../DepositManager/DepositManager.sol => /dev/null |  473 ---
 .../DepositManagerProxy.p.sol => /dev/null         |  220 --
 .../ERC20Predicate/ERC20Predicate.sol => /dev/null | 1137 -------
 .../ERC20PredicateProxy.p.sol => /dev/null         |  151 -
 .../ERC20PredicateBurnOnly.sol => /dev/null        | 1115 -------
 .../ERC721PredicateBurnOnly.sol => /dev/null       | 1120 -------
 .../Ethereum_SpokePool/Ethereum_SpokePool.sol      |   86 +-
 .../.flat@19718050/FxRoot.sol => /dev/null         |   24 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../GnosisSafeProxy.p.sol => /dev/null             |   34 -
 .../GnosisSafe.sol => /dev/null                    |  952 ------
 .../Proxy.p.sol => /dev/null                       |   38 -
 .../GnosisSafe.sol => /dev/null                    |  958 ------
 .../Proxy.p.sol => /dev/null                       |   38 -
 .../Governance/Governance.sol => /dev/null         |   83 -
 .../Governance/GovernanceProxy.p.sol => /dev/null  |  156 -
 .../.flat@19718050/Inbox/Inbox.sol => /dev/null    | 1181 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1CrossDomainMessenger.sol => /dev/null        | 1513 ---------
 .../Lib_ResolvedDelegateProxy.p.sol => /dev/null   |   67 -
 .../L1CrossDomainMessenger.sol => /dev/null        | 1727 ----------
 .../ResolvedDelegateProxy.p.sol => /dev/null       |   54 -
 .../L1DAITokenBridge.sol => /dev/null              |  482 ---
 .../L1ERC20Gateway/L1ERC20Gateway.sol => /dev/null | 1381 --------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../.flat@19718050/L1Escrow.sol => /dev/null       |   39 -
 .../L1GatewayRouter.sol => /dev/null               |  991 ------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  442 ---
 .../L1ChugSplashProxy.p.sol => /dev/null           |  268 --
 .../L1StandardBridge.sol => /dev/null              | 1586 ---------
 .../L1ChugSplashProxy.p.sol => /dev/null           |  343 --
 .../L1StandardBridge.sol => /dev/null              | 1537 ---------
 .../Lib_AddressManager.sol => /dev/null            |  151 -
 .../.flat@19718050/MaticToken.sol => /dev/null     |  438 ---
 .../.flat@19718050/MaticWETH.sol => /dev/null      |  289 --
 .../MerklePatriciaProof.sol => /dev/null           |  413 ---
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../dev/null                                       | 1057 ------
 .../OptimismPortal.sol => /dev/null                | 3425 --------------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../OptimismPortal.sol => /dev/null                | 2881 ----------------
 .../Proxy.p.sol => /dev/null                       |  210 --
 .../{.flat@19718050 => .flat}/Optimism_Adapter.sol |  156 +-
 .../{.flat@19718050 => .flat}/Polygon_Adapter.sol  |  342 +-
 .../dev/null                                       |  297 --
 .../dev/null                                       |  297 --
 .../dev/null                                       |  139 -
 .../dev/null                                       |  146 -
 .../dev/null                                       |  131 -
 .../.flat@19718050/ProxyERC20.sol => /dev/null     |  305 --
 .../.flat@19718050/ReadProxy.sol => /dev/null      |   62 -
 .../.flat@19718050/Registry.sol => /dev/null       |  150 -
 .../RootChain/RootChain.sol => /dev/null           |  608 ----
 .../RootChain/RootChainProxy.p.sol => /dev/null    |  193 --
 .../RootChainManager.sol => /dev/null              | 2087 ------------
 .../RootChainManagerProxy.p.sol => /dev/null       |  151 -
 .../SequencerInbox/SequencerInbox.sol => /dev/null | 1086 -------
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  628 ----
 .../StakeManager/StakeManager.sol => /dev/null     | 2112 ------------
 .../StakeManagerProxy.p.sol => /dev/null           |  145 -
 .../.flat@19718050/StateSender.sol => /dev/null    |  178 -
 .../SuperchainConfig/Proxy.p.sol => /dev/null      |  199 --
 .../SuperchainConfig.sol => /dev/null              |  476 ---
 .../.flat@19718050/Synthetix.sol => /dev/null      | 1662 ----------
 .../SynthetixBridgeToOptimism.sol => /dev/null     | 1284 --------
 .../.flat@19718050/Timelock.sol => /dev/null       |  675 ----
 .../TransparentUpgradeableProxy.p.sol => /dev/null |  630 ----
 .../UpgradeExecutor.sol => /dev/null               |  995 ------
 .../.flat@19718050/ValidatorShare.sol => /dev/null |  802 -----
 .../ethereum/.flat@19718050/WETH9.sol => /dev/null |   62 -
 .../.flat@19718050/Whitelist.sol => /dev/null      |   39 -
 .../WithdrawManager.sol => /dev/null               | 1267 --------
 .../WithdrawManagerProxy.p.sol => /dev/null        |  222 --
 84 files changed, 828 insertions(+), 53135 deletions(-)
```

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19718050 (main branch discovery), not current.

```diff
+   Status: CREATED
    contract  (0x01F645DcD6C796F6BC6C982159B32fAaaebdC96A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x0475cBCAebd9CE8AfA5025828d5b98DFb67E059E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0x10A5F7D9D65bCc2734763444D4940a31b109275f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1DAITokenBridge (0x10E6593CDda8c58a1d0f14C5164B376352a55f2F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20PredicateBurnOnly (0x158d5fa3Ef8e4dDA8a5367deCF76b94E7efFCe95)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SequencerInbox (0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateSender (0x28e4F3a7f651294B9564800b2D01f35189A5bFbE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WithdrawManager (0x2A88696e0fFA76bAA1338F2C74497cC013495922)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x3154Cf16ccdb4C6d922629664174b904d80F2C35)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Registry (0x33a02E6cC863D393d6Bf231B697b82F6e499cA71)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SynthetixBridgeToOptimism (0x39Ea01a0298C315d149a490E34B59Dbf2EC7e48F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeExecutor (0x3ffFbAdAF827559da092217e474760E2b2c3CeDd)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DepositManager (0x401F6c983eA34274ec46f84D70b31C151321188b)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC20Predicate (0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1Escrow (0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x49048044D57e1C92A77f79988d21Fa8fAF74E97e)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Inbox (0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ReadProxy (0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ERC721PredicateBurnOnly (0x54150f44c785D412Ec262fe895Cc3B689c72F49B)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x554723262467F125Ac9e1cDFa9Ce15cc53822dbD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5613AF0474EB9c528A34701A5b1662E3C8FA0678)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract StakeManager (0x5e3Ef299fDDf15eAa0432E6e66473ace8c13D908)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Dai (0x6B175474E89094C44Da98b954EedeAC495271d0F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Governance (0x6e7a5820baD6cebA8Ef5ea69c0C92EbbDAc9CE48)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1GatewayRouter (0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x7bB41C3008B3f03FE483B28b8DB90e19Cf07595c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticToken (0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Bridge (0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x866E82a600A1414e583f7F13623F1aC5d58b0Afa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChain (0x86E4Dc95c7FBdBf52e33D563BbDB00823894C287)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x8EfB6B5c4767B09Dc9AA6Af4eAA89F749522BaE2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x9aD46fac0Cf7f790E5be05A0F15223935A0c0aDa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract RootChainManager (0xA0c68C638235ee32657e8f720a23ceC1bFc77C77)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC20Gateway (0xa3A7B6F88361F48403514059F1F16C8E78d60EeC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MaticWETH (0xa45b966996374E9e65ab991C6FE4Bfce3a56DDe8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MerklePatriciaProof (0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xa8E31E3C38aDD6052A9407298FAEB8fD393A6cF9)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal (0xbEb5Fc579115071764c7423A4f12eDde41f106Ed)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyERC20 (0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract WETH9 (0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Timelock (0xCaf0aa768A3AE1297DF20072419Db8Bb8b5C8cEf)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Whitelist (0xD485e5c28AA4985b23f6DF13dA03caa766dcd459)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Synthetix (0xd711709eFc452152B7ad11DbD01ed4B69c9421B3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract  (0xD9c7C4ED4B66858301D0cb28Cc88bf655Fe34861)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xdc883b9d9Ee16f74bE08826E68dF4C9D9d26e8bD)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Lib_AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xE1cc2332852B2Ac0dA59A1f9D3051829f4eF3c1C)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xEb3107117FEAd7de89Cd14D463D340A2E6917769)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ValidatorShare (0xf98864DA30a5bd657B13e70A57f5718aBf7BAB31)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0xFa7D2a996aC6350f4b56C043112Da0366a59b74c)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiCollateralSynth (0xfb020CA7f4e8C4a5bBBe060f59a249c6275d2b69)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FxRoot (0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2)
    +++ description: None
```

Generated with discovered.json: 0xb4bd133d76516e18e5f01eab8e4bd307d27863c2

# Diff at Tue, 23 Apr 2024 12:22:02 GMT:

- author: sekuba (<sekuba@users.noreply.githum.com>)
- comparing to: main@0c5cebacabe91d4bb808f51a732583d8107ec7bc block: 19645947
- current block number: 19718050

## Description

Liveness value in the HubPool (token escrow) is decreased from 1,5 to 1h. This is the time before a subitted root bundle is finalized and cannot be disputed anymore (And when relayers are reimbursed with tokens).

## Watched changes

```diff
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda) {
    +++ description: None
      values.liveness:
-        5400
+        3600
    }
```

Generated with discovered.json: 0x5c90684b94ec67ec0205143a888b5085c83eecf9

# Diff at Sat, 13 Apr 2024 10:06:54 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@ce9ed778ed3251d8c0182e8225fd576d18383215 block: 19631863
- current block number: 19645947

## Description

Tidy up config.jsonc:

- no onchain changes
- scope of discovery config stays the same (+Linea adapter added)

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19631863 (main branch discovery), not current.

```diff
-   Status: DELETED
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319)
    +++ description: None
```

```diff
-   Status: DELETED
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763)
    +++ description: None
```

```diff
-   Status: DELETED
    contract ProxyAdmin (0x5B0bb17755FBa06028530682E2FD5bc373931768)
    +++ description: None
```

```diff
-   Status: DELETED
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3)
    +++ description: None
```

```diff
-   Status: DELETED
    contract UpgradeableBeacon (0x971f46a2852d11D59dbF0909e837cfd06f357DeB)
    +++ description: None
```

```diff
-   Status: DELETED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761)
    +++ description: None
```

```diff
-   Status: DELETED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083)
    +++ description: None
```

Generated with discovered.json: 0x89400dca91a7d0ef56df44dae3bda28049f2ef91

# Diff at Thu, 11 Apr 2024 10:44:49 GMT:

- author: sekuba (<sekuba@users.noreply.github.com>)
- comparing to: main@4b6ab939705ef1b9fdc0ffd8813b4869519e6547 block: 19574841
- current block number: 19631863

## Description

Config related.

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 19574841 (main branch discovery), not current.

```diff
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a) {
    +++ description: None
      upgradeability.threshold:
+        "2 of 4 (50%)"
    }
```

```diff
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3) {
    +++ description: None
      upgradeability.threshold:
+        "4 of 8 (50%)"
    }
```

```diff
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715) {
    +++ description: None
      upgradeability.threshold:
+        "3 of 5 (60%)"
    }
```

Generated with discovered.json: 0x71164dd68d40c603ad2f2be8190d8e65dd9a7765

# Diff at Wed, 03 Apr 2024 11:07:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19574841

## Description

- added Linea support
- SpokePool upgrade: various functions to register orders, updated to V3 specs. // does it use merkle proofs to withdraw funds?
  Plus some counters of filled orders and deposits. These counters are designed to implement a fee mechanism that is based on a canonical history of deposit and fill events and how they update a virtual running balance of liabilities and assets, which then determines the LP fee charged to relays. Plus some error handling, handling of non-expiring deposits.

Workflow - from the contract:
Request to bridge input token cross chain to a destination chain and receive a specified amount of output tokens. The fee paid to relayers and the system should be captured in the spread between output amount and input amount when adjusted to be denominated in the input token. A relayer on the destination chain will send outputAmount of outputTokens to the recipient and receive inputTokens on a repayment chain of their choice. Therefore, the fee should account for destination fee transaction costs, the relayer's opportunity cost of capital while they wait to be refunded following an optimistic challenge window in the HubPool, and the system fee that they'll be charged. On the destination chain, the hash of the deposit data will be used to uniquely identify this deposit, so modifying any params in it will result in a different hash and a different deposit. The hash will comprise all parameters to this function along with this chain's chainId(). Relayers are only refunded for filling deposits with deposit hashes that map exactly to the one emitted by this contract.

## Initial discovery

```diff
+   Status: CREATED
    contract VotingToken (0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828)
    +++ description: None
```

```diff
+   Status: CREATED
    contract TokenBridge (0x051F1D88f0aF5763fB888eC4378b4D8B29ea3319)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Arbitrum_Adapter (0x29528780E29abb8Af95a5e5a125b94766987543F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Base_Adapter (0x2d8B1e2B0Dff62DF132d23BEa68a6D2c4D20046E)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Boba_Adapter (0x33B0Ec794c15D6Cc705818E70d4CaCe7bCfB5Af3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BridgedToken (0x36f274C1C197F277EA3C57859729398FCc8a3763)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Polygon_Adapter (0x3E94e8d4316a1eBfb2245E45E6F0B8724094CE1A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Finder (0x40f941E48A552bF496B154Af6bf55725f18D77c3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProposerV2 (0x50efaC9619225d7fB4703C5872da978849B6E7cC)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_Adapter (0x527E872a5c3f0C7c24Fe33F2593cFB890a285084)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x5B0bb17755FBa06028530682E2FD5bc373931768)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Ethereum_SpokePool (0x5c7BCd6E7De5423a257D81B442095A1a6ced35C5)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GovernorV2 (0x7b292034084A41B9D441B71b6E3557Edd0463fa8)
    +++ description: None
```

```diff
+   Status: CREATED
    contract LpTokenFactory (0x7dB69eb9F52eD773E9b03f5068A1ea0275b2fD9d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Linea_Adapter (0x7Ea0D1882D610095A45E512B0113f79cA98a8EfE)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposalExecutor (0x8180D59b7175d4064bDFA8138A58e9baBFFdA44a)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticGovernor (0x8692B776d1Ff0664177c90465038056Dc64f8991)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x892bb7EeD71efB060ab90140e7825d8127991DD3)
    +++ description: None
```

```diff
+   Status: CREATED
    contract EmergencyProposer (0x91F1804aCaf87C2D34A34A70be1bb16bB85D6748)
    +++ description: None
```

```diff
+   Status: CREATED
    contract UpgradeableBeacon (0x971f46a2852d11D59dbF0909e837cfd06f357DeB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract MultiSend (0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism_Adapter (0xAd1b0a86c98703fd5F4E56fff04F6b2D9b9f246F)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubPool Multisig (0xB524735356985D2f267FA010D681f061DfF03715)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CoveredCallFinancialProductLibrary (0xBbc6009fEfFc27ce705322832Cb2068F8C1e0A58)
    +++ description: None
```

```diff
+   Status: CREATED
    contract HubPool (0xc186fA914353c44b2E33eBE05f21846F1048bEda)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ZkSync_Adapter (0xE233009838CB898b50e0012a6E783FC9FeE447FB)
    +++ description: None
```

```diff
+   Status: CREATED
    contract BondToken (0xee1DC6BCF1Ee967a350e9aC6CaaAA236109002ea)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Roles (0xF24f1DC519d88246809B660eb56D94048575d083)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimisticOracleV3 (0xfb55F43fB9F48F63f9269DB7Dde3BbBe1ebDC0dE)
    +++ description: None
```
