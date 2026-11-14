Generated with discovered.json: 0x26be3a2e2f755b557ab62a8f221c4c4eb475d94a

# Diff at Sat, 14 Nov 2026 23:04:44 GMT:

- id: 3bb72159
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1794697422

## Description

Initial discovery of the Phylax Credible Layer: the CredibleRegistry with its timelock and the production StateOracle with its ProxyAdmin and verifiers.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x003C71246D92fae09ae3F3CAeFF234c8B8242F2E) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract StateOracle (eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D) [phylax/StateOracle]
    +++ description: Records which assertions apply to each protected contract (assertion adopter). Assertions are rule contracts that enforcers run offchain. Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Every addition or removal records an activation or deactivation block 75 blocks ahead. An assertion is accepted only with a proof that a registered DA verifier checks against its ID.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130) [phylax/AdminVerifierWhitelist]
    +++ description: Admin verifier that lets an account register as the manager of an adopter only if a whitelist admin assigned that account to the adopter. It is consulted only at registration. A whitelist admin can also exclude an adopter, which deletes its assignment and blocks new ones until the releaser named in the exclusion lifts it.
```

```diff
+   Status: CREATED
    contract DAVerifierOnChain (eth:0x5d8070789035f77624153CbF7d4cdCecfd520c5A) [phylax/DAVerifierOnChain]
    +++ description: DA verifier that accepts an assertion only if the keccak256 hash of the submitted proof equals the assertion ID, so the bytes behind the ID are published onchain with the assertion.
```

```diff
+   Status: CREATED
    contract TimelockController (eth:0x9F66A1A08a3f9f9De7a95DfBAD572970bF1D9757) [global/TimelockController]
    +++ description: A timelock with access control. The current minimum delay is 3d.
```

```diff
+   Status: CREATED
    contract PhylaxMultisig (eth:0xa4556B53286206A9B50e65700C4372c9Be62b934) [GnosisSafe]
    +++ description: None
```

```diff
+   Status: CREATED
    contract CredibleRegistry (eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70) [phylax/CredibleRegistry]
    +++ description: Records the last block a whitelisted builder marked as credible. isCredibleBlock() returns true from the marker transaction to the end of that block, and for calls with a zero gas price such as simulations. Builder and delay changes are scheduled on the registry's own timelock and wait at least 3d.
```
