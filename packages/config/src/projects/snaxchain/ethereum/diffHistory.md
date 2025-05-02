Generated with discovered.json: 0xf542cc3917d6fc395e73ec3c1e28cad59fc0a311

# Diff at Tue, 29 Apr 2025 08:19:12 GMT:

- author: Adrian Adamiak (<adrian@adamiak.net>)
- comparing to: main@ef7477af00fe0b57a2f7cacf7e958c12494af662 block: 22194661
- current block number: 22194661

## Description

Field .issuedPermissions is removed from the output as no longer needed. Added 'permissionsConfigHash' due to refactoring of the modelling process (into a separate command).

## Config/verification related changes

Following changes come from updates made to the config file,
or/and contracts becoming verified, not from differences found during
discovery. Values are for block 22194661 (main branch discovery), not current.

```diff
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634) {
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6) {
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743) {
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
      issuedPermissions:
-        [{"permission":"guard","to":"0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9) {
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"it can update the preconfer address, the batch submitter (Sequencer) address and the gas configuration of the system.","via":[]},{"permission":"sequence","to":"0x060b915cA4904b56adA63565626b9c97F6CaD212","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5) {
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"upgrading the bridge implementation can give access to all funds escrowed therein.","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411) {
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
      issuedPermissions:
-        [{"permission":"interact","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","description":"set and change address mappings.","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A) {
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
      issuedPermissions:
-        [{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

```diff
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25) {
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
      issuedPermissions:
-        [{"permission":"challenge","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[]},{"permission":"propose","to":"0x85C73d8F7a3C95667779E0d9b8104982A5C1d04e","via":[]},{"permission":"upgrade","to":"0x4a4962275DF8C60a80d3a25faEc5AA7De116A746","via":[{"address":"0x672B75103c0CbFdCC4A40737a80724f87a8A25D7"}]}]
    }
```

Generated with discovered.json: 0x74944c7050bcaf771fc0dda9b21bfd9a82bf82b1

# Diff at Fri, 04 Apr 2025 09:41:20 GMT:

- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current block number: 22194661

## Description

Initial discovery of a standard OP stack rollup without proof system.

## Initial discovery

```diff
+   Status: CREATED
    contract L1CrossDomainMessenger (0x2A4fC0E3B365052d71B9853Efd0123985559f62E)
    +++ description: Sends messages from host chain to this chain, and relays messages back onto host chain. In the event that a message sent from host chain to this chain is rejected for exceeding this chain's epoch gas limit, it can be resubmitted via this contract's replay function.
```

```diff
+   Status: CREATED
    contract GnosisSafe (0x42d27eEA1AD6e22Af6284F609847CB3Cd56B9c64)
    +++ description: None
```

```diff
+   Status: CREATED
    contract L1ERC721Bridge (0x45561F85e43Ac0d2258c0F0C16540ce128EA1634)
    +++ description: Used to bridge ERC-721 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract Conduit Multisig 1 (0x4a4962275DF8C60a80d3a25faEc5AA7De116A746)
    +++ description: None
```

```diff
+   Status: CREATED
    contract ProxyAdmin (0x672B75103c0CbFdCC4A40737a80724f87a8A25D7)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SuperchainConfig (0x7439cCf2f0c7569a9B69c86fcE0B58EC771cf1a6)
    +++ description: This is NOT the shared SuperchainConfig contract of the OP stack Superchain but rather a local fork. It manages the `PAUSED_SLOT`, a boolean value indicating whether the local chain is paused, and `GUARDIAN_SLOT`, the address of the guardian which can pause and unpause the system.
```

```diff
+   Status: CREATED
    contract OptimismPortal (0x936D881b4760D5e9b6D55b774f65c509236b4743)
    +++ description: The main entry point to deposit funds from host chain to this chain. It also allows to prove and finalize withdrawals.
```

```diff
+   Status: CREATED
    contract OpFoundationOperationsSafe (0x9BA6e03D8B90dE867373Db8cF1A58d2F7F006b3A)
    +++ description: None
```

```diff
+   Status: CREATED
    contract SystemConfig (0x9c9B78f798F821C2f6398f603825fd175e2427f9)
    +++ description: Contains configuration parameters such as the Sequencer address, gas limit on this chain and the unsafe block signer address.
```

```diff
+   Status: CREATED
    contract L1StandardBridge (0xA5fb68C24b02852e8B514E98A1014faf12547Fa5)
    +++ description: The main entry point to deposit ERC20 tokens from host chain to this chain.
```

```diff
+   Status: CREATED
    contract AddressManager (0xd7BF8B8618c21F337d8eD30aC797Fa330eb94411)
    +++ description: Legacy contract used to manage a mapping of string names to addresses. Modern OP stack uses a different standard proxy system instead, but this contract is still necessary for backwards compatibility with several older contracts.
```

```diff
+   Status: CREATED
    contract OptimismMintableERC20Factory (0xeEC78bcEA0EfBbA6e1BE7aFc58C93b70f97d3A6A)
    +++ description: A helper contract that generates OptimismMintableERC20 contracts on the network it's deployed to. OptimismMintableERC20 is a standard extension of the base ERC20 token contract designed to allow the L1StandardBridge contracts to mint and burn tokens. This makes it possible to use an OptimismMintablERC20 as this chain's representation of a token on the host chain, or vice-versa.
```

```diff
+   Status: CREATED
    contract L2OutputOracle (0xF8f3EbF2469C00A00EA9D1D04913B73896268B25)
    +++ description: Contains a list of proposed state roots which Proposers assert to be a result of block execution. Currently only the PROPOSER address can submit new state roots.
```
