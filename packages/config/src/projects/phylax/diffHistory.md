Generated with discovered.json: 0xe3dc1ed9e5cb67029fe7fc0bf827357c2663a347

# Diff at Mon, 16 Nov 2026 22:13:11 GMT:

- id: 3bb72159
- author: vincfurc (<vincfurc@users.noreply.github.com>)
- current timestamp: 1794851290

## Description

Initial discovery of the Phylax Credible Layer: the CredibleRegistry and three StateOracles with their admins and verifiers.

## Initial discovery

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x003C71246D92fae09ae3F3CAeFF234c8B8242F2E) [N/A]
    +++ description: None
```

```diff
+   Status: CREATED
    contract DAVerifierECDSA (eth:0x12b2E5606688b0B111D7eb961b24A5BC032B4C0f) [phylax/DAVerifierECDSA]
    +++ description: DA verifier that accepts an assertion only if its proof is DA_PROVER's signature of the assertion ID. The assertion's code is not required onchain.
```

```diff
+   Status: CREATED
    contract StateOracle (eth:0x14386aF70E91dFE12aC6243D4B5e087870d7f14D) [phylax/StateOracle]
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 75 blocks later, and a new assertion needs a proof that a registered DA verifier accepts.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x1Ab8D3CDb7eE245abD53859F8D967a4F9a91a130) [phylax/AdminVerifierWhitelist]
    +++ description: Admin verifier that approves a manager registration only from the account a whitelist admin assigned to that adopter. Whitelist admins can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x25642997751A2F1bbA234a3B1c2100bD0aB9a73E) [phylax/AdminVerifierWhitelist_ownable]
    +++ description: Admin verifier that approves a manager registration only from the account the owner assigned to that adopter. The owner can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
```

```diff
+   Status: CREATED
    contract AdminVerifierWhitelist (eth:0x3107dbCe36e98FE30539DE78bd0899bDCd9Ca291) [phylax/AdminVerifierWhitelist_ownable]
    +++ description: Admin verifier that approves a manager registration only from the account the owner assigned to that adopter. The owner can also exclude an adopter, which blocks assignments until the exclusion's releaser lifts it. Assignments are checked only at registration.
```

```diff
+   Status: CREATED
    contract DAVerifierOnChain (eth:0x5d8070789035f77624153CbF7d4cdCecfd520c5A) [phylax/DAVerifierOnChain]
    +++ description: DA verifier that accepts an assertion only if its proof hashes (keccak256) to the assertion ID, so the assertion's bytes are published onchain.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0x69Fb398BdF54C8313C4C0fd6087128d6E8527bbA) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminVerifierOwner (eth:0x6d67e393eFc3E48e522Fa5829438fe799C5DB7be) [phylax/AdminVerifierOwner]
    +++ description: Admin verifier that approves only the account returned by the adopter's owner() as its manager.
```

```diff
+   Status: CREATED
    contract AdminVerifierAlwaysApprove (eth:0x6e6EE23D01E5B1dA7054923286681AA432EB7892) [N/A]
    +++ description: Admin verifier that approves every request, so any account allowed to register can claim any adopter without a manager.
```

```diff
+   Status: CREATED
    EOA (eth:0x711f5a08857ae2a1eb6bF1BFDDe962188a65EE50)
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminVerifierAlwaysApprove (eth:0x90792771aeA614983f1AD851De764276D0D9D279) [N/A]
    +++ description: Admin verifier that approves every request, so any account allowed to register can claim any adopter without a manager.
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
    contract StateOracle (eth:0xB5E1b58638E05a69c853dEf16837D651B7EEeAA2) [phylax/StateOracle_singleDAVerifier]
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 10 blocks later, a new assertion needs a proof that DA_VERIFIER accepts, and a removed assertion cannot be added again.
```

```diff
+   Status: CREATED
    contract CredibleRegistry (eth:0xbac71Fe7a8C78F49Eeb2D33b250988224796AF70) [phylax/CredibleRegistry]
    +++ description: Records the last block a whitelisted builder marked as credible. isCredibleBlock() returns true from the marker to the end of that block and in calls with a zero gas price. Changes to the builder set and to the delay are timelocked for at least 3d.
```

```diff
+   Status: CREATED
    contract StateOracle (eth:0xbFBc833F12E973bd4A2cc46AAE959aD1B9531262) [phylax/StateOracle_singleDAVerifier]
    +++ description: Registry of assertions, rules that enforcers run offchain, per protected contract (adopter). Each adopter has a manager, approved by a registered admin verifier, who adds and removes its assertions. Changes take effect 10 blocks later, a new assertion needs a proof that DA_VERIFIER accepts, and a removed assertion cannot be added again.
```

```diff
+   Status: CREATED
    contract AdminVerifierOwner (eth:0xCb2e47Abe9b093462aa0e7FA3221fc3Fc90C4dFb) [phylax/AdminVerifierOwner]
    +++ description: Admin verifier that approves only the account returned by the adopter's owner() as its manager.
```

```diff
+   Status: CREATED
    contract ProxyAdmin (eth:0xD808cF91d30A99DCB8f6D8c3563475628863bdEE) [global/ProxyAdmin]
    +++ description: None
```

```diff
+   Status: CREATED
    contract AdminVerifierSuperAdmin (eth:0xd9eaa6063cE1D8b6A20648dF961cA89D5F19c517) [phylax/AdminVerifierSuperAdmin]
    +++ description: Admin verifier that approves only SUPER_ADMIN_ROLE holders, each of whom can become the manager of any adopter without one.
```

```diff
+   Status: CREATED
    contract DAVerifierECDSA (eth:0xeedd9c29D597B378108483Bd46eaDC65044713f1) [phylax/DAVerifierECDSA]
    +++ description: DA verifier that accepts an assertion only if its proof is DA_PROVER's signature of the assertion ID. The assertion's code is not required onchain.
```

```diff
+   Status: CREATED
    EOA (eth:0xF31b02F47596AcC7328E9fb04aFc52Fe91Da6071)
    +++ description: None
```
