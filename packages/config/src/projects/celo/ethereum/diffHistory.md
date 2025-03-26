Generated with discovered.json: 0x4fe963098763ef9ae144f7306873c05e319c6c0d

# Diff at Wed, 26 Mar 2025 13:47:13 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22131469

## Description

Initial discovery: Standard OptiPortal2 opstack chain with new SuperchainConfig setup (local with global override).

## Initial discovery

```diff
+   Status: CREATED
    contract LivenessModule (0x0454092516c9A4d636d3CAfA1e82161376C8a748)
    +++ description: used to remove members inactive for 98d while making sure that the threshold remains above 75%. If the number of members falls below 8, the 0x847B5c174615B1B7fDF770882256e2D3E95b9D92 takes ownership of the multisig
```

```diff
+   Status: CREATED
    contract Optimism Guardian Multisig (0x09f7150D8c019BeF34450d6920f6B3608ceFdAf2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x1AC1181fc4e4F877963680587AEAa2C90D7EbB95)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x2bCeB78Fda0d5e3bfA7F4B8c499aa74bDf8D7755)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract CeloProxyAdminOwner (0x4092A77bAF58fef0309452cEaCb09221e556E112)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdmin (0x543bA4AADBAb8f9025686Bd03993043599c6fB04)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0x55093104b76FAA602F9d6c35A5FFF576bE78d753)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract SuperchainProxyAdminOwner (0x5a0Aae59D09fccBdDb6C6CcEB07B7279367C3d2A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0x6f0E4f1EB98A52EfaCF7BE11d48B9d9d6510A906)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x783A434532Ee94667979213af1711505E8bFE374)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OpFoundationUpgradeSafe (0x847B5c174615B1B7fDF770882256e2D3E95b9D92)
    +++ description: None
```

```diff
+   Status: CREATED
    contract FaultDisputeGame (0x876e8eeE292F23F163C9bCA406eDD65bEAEFBEBC)
    +++ description: Logic of the dispute game. When a state root is proposed, a dispute game contract is deployed. Challengers can use such contracts to challenge the proposed state root.
```

```diff
+   Status: CREATED
    contract SystemConfig (0x89E31965D844a309231B1f17759Ccaf1b7c09861)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract MIPS (0x8A12E1754f729C0856E2E32D4821577f0B245bfA)
    +++ description: The MIPS contract is used to execute the final step of the dispute game which objectively determines the winner of the dispute.
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x95703e0982140D16f8ebA6d158FccEde42f04a4C)
    +++ description: Used to manage global configuration values for multiple OP Chains within a single Superchain network. The SuperchainConfig contract manages the `PAUSED_SLOT`, a boolean value indicating whether the Superchain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DelayedWETH (0x9c314E8057025F2982aa4B3923Abd741A8e8DE91)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Celo Multisig 2 (0x9Eb44Da23433b5cAA1c87e35594D15FcEb08D34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504)
    +++ description: Contains the latest confirmed state root that can be used as a starting point in a dispute game.
```

```diff
+   Status: CREATED
    contract DelayedWETH (0xa316D42E8Fd98D2Ec364b8bF853d2623E768f95a)
    +++ description: Contract designed to hold the bonded ETH for each game. It is designed as a wrapper around WETH to allow an owner to function as a backstop if a game would incorrectly distribute funds.
```

```diff
+   Status: CREATED
    contract SuperchainConfigLocal (0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33)
    +++ description: A local contract acting as source of truth for the paused status and the guardian role for the local chain.
```

```diff
+   Status: CREATED
    contract Celo Multisig 1 (0xC03172263409584f7860C25B6eB4985f0f6F4636)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Optimism Security Council (0xc2819DC788505Aac350142A7A707BF9D03E3Bd03)
    +++ description: None
```

```diff
+   Status: CREATED
    contract OptimismPortal2 (0xc5c5D157928BDBD2ACf6d0777626b6C75a9EAEDC)
    +++ description: The OptimismPortal contract is the main entry point to deposit funds from L1 to L2. It also allows to prove and finalize withdrawals. It specifies which game type can be used for withdrawals, which currently is the PermissionedDisputeGame.
```

```diff
+   Status: CREATED
    contract DeputyGuardianModule (0xc6901F65369FC59fC1B4D6D6bE7A2318Ff38dB5B)
    +++ description: allows the 0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A, called the deputy guardian, to act on behalf of the Gnosis Safe.
```

```diff
+   Status: CREATED
    contract Safe (0xD1C635987B6Aa287361d08C6461491Fa9df087f2)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xfaB0F466955D87e596Ca87E20c505bB6470D0DC4)
    +++ description: The PreimageOracle contract is used to load the required data from L1 for a dispute game.
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683)
    +++ description: The dispute game factory allows the creation of dispute games, used to propose state roots and eventually challenge them.
```
