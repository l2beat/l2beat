Generated with discovered.json: 0x71164dd68d40c603ad2f2be8190d8e65dd9a7765

# Diff at Wed, 03 Apr 2024 11:07:55 GMT:

- author: vincfurc (<10850139+vincfurc@users.noreply.github.com>)
- current block number: 19574841

## Description

- added bridged token contract: the bridge can mint and burn these tokens (onlyBridge)
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
