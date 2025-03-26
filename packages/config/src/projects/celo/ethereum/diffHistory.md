Generated with discovered.json: 0x721a1967bcae80eb04f5dc5efa1df85f99a65b91

# Diff at Wed, 26 Mar 2025 08:25:24 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22129863

## Description

Initial discovery

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
    +++ description: None
```

```diff
+   Status: CREATED
    contract LivenessGuard (0x24424336F04440b1c28685a38303aC33C9D14a25)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x3C519816C5BdC0a0199147594F83feD4F5847f13)
    +++ description: None
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x4092A77bAF58fef0309452cEaCb09221e556E112)
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
    +++ description: None
```

```diff
+   Status: CREATED
    contract PermissionedDisputeGame (0x705959Aadfec98C3718973B8A8A3d21632d31bB7)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
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
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0x9C4955b92F34148dbcfDCD82e9c9eCe5CF2badfe)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0x9Eb44Da23433b5cAA1c87e35594D15FcEb08D34d)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AnchorStateRegistry (0xa24Bf5Bc02997f63da4e2C7F802067e05a102504)
    +++ description: None
```

```diff
+   Status: CREATED
    contract CeloSuperchainConfig (0xa440975E5A6BB19Bc3Bee901d909BB24b0f43D33)
    +++ description: None
```

```diff
+   Status: CREATED
    contract Safe (0xC03172263409584f7860C25B6eB4985f0f6F4636)
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
    +++ description: None
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
    contract PermissionedDisputeGame (0xd70143f2535C1aFc82322c2384b233Dc7847CE3c)
    +++ description: Same as FaultDisputeGame, but only two permissioned addresses are designated as proposer and challenger.
```

```diff
+   Status: CREATED
    contract AddressManager (0xdE1FCfB0851916CA5101820A69b13a4E276bd81F)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract PreimageOracle (0xfaB0F466955D87e596Ca87E20c505bB6470D0DC4)
    +++ description: None
```

```diff
+   Status: CREATED
    contract DisputeGameFactory (0xFbAC162162f4009Bb007C6DeBC36B1dAC10aF683)
    +++ description: None
```
