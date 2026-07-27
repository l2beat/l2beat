Generated with discovered.json: 0x7a401b2debf7d39a38e0f3a4353e8158bf439c4f

# Diff at Mon, 20 Jul 2026 08:54:38 GMT:

- author: Luca Donno (<donnoh99@gmail.com>)
- current timestamp: 1784537565

## Description

Discovery rerun on the same block number with only config-related changes.

## Initial discovery

```diff
+   Status: CREATED
    contract L1ERC721Bridge (eth:0x01A6274B9607ac024e8c191E491d0b25ad14c217) [opstack/L1ERC721Bridge]
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Rise Guardian Multisig (eth:0x03B85FAa108C10F6EFfec1d91954DE99dA32FB46) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x0459d576A6223fEeA177Fb3DF53C9c77BF84C459) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v5.0.0).
```

```diff
+   Status: CREATED
    contract PreimageOracle (eth:0x1fb8cdFc6831fc866Ed9C51aF8817Da5c287aDD3) [opstack/PreimageOracle]
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (eth:0x2e7758aAD2B6D3D1Fd2C937D9B322378fC644633) [opstack/PermissionedDisputeGame]
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract SP1VerifierGateway (eth:0x3B6041173B80E77f038f3F2C0f9744f04837185e) [succinct/SP1VerifierGateway]
    +++ description: This contract is the router for zk proof verification. It stores the mapping between identifiers and the address of onchain verifier contracts, routing each identifier to the corresponding verifier contract.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x4ebc046b1cfc12659A19E124b0ea8a382777E542) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (eth:0x551A672d703966D83C3EC3ea0e844f43c3373c91) [opstack/AnchorStateRegistry_post13_opsuccinct]
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game. It specifies which game type can be used for withdrawals, which currently is the OPSuccinctFaultDisputeGame. Variant for chains using OPSuccinct (SP1) games instead of Cannon, which omits Cannon-specific cross-contract fields (vm, oracle, weth, challengePeriod, absolutePrestate from game).
```

```diff
+   Status: CREATED
    contract L1StandardBridge (eth:0x553257678Dd11a6668a92934AAB005e420c6535A) [opstack/L1StandardBridge]
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract MIPS (eth:0x6463dEE3828677F6270d83d45408044fc5eDB908) [opstack/MIPS]
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (eth:0x6A4139810986CF13408330e14C4ac9Daf0511aA3) [opstack/DisputeGameFactory]
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0x8a0fd5e825D14368d90Fe68F31fceAe3E17AFc5C) [succinct/SP1Verifier]
    +++ description: Verifier contract for SP1 proofs (v6.0.0).
```

```diff
+   Status: CREATED
    contract Rise ProxyAdminOwner Multisig (eth:0x9196464e3F828A50233C20732fa6898F4317002c) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (eth:0xad92Fa18EB74E46Db844240623124BF46589db4C) [opstack/OptimismPortal2]
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the 42.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (eth:0xB786207A1EdfC724c1d507335f403F53fd9E79d6) [opstack/SuperchainConfigFake_expiry]
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages pause states for each chain connected to it, as well as a global pause state for all chains. The guardian role can pause either separately, but each pause expires after 3mo 1d if left untouched.
```

```diff
+   Status: CREATED
    contract OPSuccinctFaultDisputeGame (eth:0xBf60dBc272833cD25f0426983c3175C32C8E5A7a) [succinct/OPSuccinct/OPSuccinctFaultDisputeGame]
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (eth:0xC0de1d9B1cD2Caf782355C66a6A8e5948e63c9c6) [opstack/L1CrossDomainMessenger]
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract SP1Verifier (eth:0xc3c6dDDAc8829b233Dc6536Ec024775a57b0AF2A) [shared-sp1/SP1Verifier]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SP1VerifierGatewayMultisig (eth:0xCafEf00d348Adbd57c37d1B77e0619C6244C6878) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xCf32d8c4Be30cA330c1150916A71A651bADd70d5) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (eth:0xD3CAf2A473dBB5bc2E8FB7F328e01AB9B726a24f) [opstack/SystemConfig]
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract AddressManager (eth:0xdE3a0F0122f702e018e04C6D0824B724E8Be8e16) [opstack/AddressManager]
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (eth:0xE2B9526277DcD2B27222Df760D6427213AC9dbb8) [opstack/OptimismMintableERC20Factory]
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintableERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract DelayedWETH (eth:0xf758C3bf7a4E2ad513B371B40c4Bd9A0E9716CF1) [opstack/DelayedWETH]
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract AccessManager (eth:0xF90a72FC295DBEf2fD27629Fda4B98Fd3E842d17) [succinct/OPSuccinct/AccessManager]
    +++ description: Contract managing access control for proposers and challengers in OPSuccinct.
```
