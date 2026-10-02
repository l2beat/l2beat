Generated with discovered.json: 0xc8c8ab4dc371d9a517f0fe6f4e658b759f5057ee

# Diff at Fri, 02 Oct 2026 12:42:14 GMT:

- id: 193c1624
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1790944823

## Description

Initial discovery of the active native ETH vault, its Groth16 proof adapter and linked Poseidon library. All three contracts were verified from public source. The owner can pause new exits and change the treasury. Signing keys and critical protocol parameters are monitored, while routine tree updates do not alert.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkApiVault (eth:0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe) [zkapi/ZkApiVault]
    +++ description: Escrows native ETH for anonymous API authorizations. Each deposit creates a publicly identified note. A Groth16 proof closes it with operator clearance or starts a delayed escape withdrawal that can be challenged with a valid request proof sharing its nullifier. The challenge does not prove service acceptance or delivery. Closures reveal the original note id, payout address and remaining balance, and send the consumed balance to the treasury. Anyone can sweep an expired active note entirely to the treasury. Pausing blocks deposits, cooperative closes and new escapes, while challenges, escape finalization and expiry sweeps remain available.
```

```diff
+   Status: CREATED
    contract Groth16ProofAdapter (eth:0x8e92013Dd7cc86f75b539DBD3814B2e603e0F9C1) [zkapi/Groth16ProofAdapter]
    +++ description: BN254 Groth16 verifier containing the request and withdrawal verification keys for zkapi-v2-note-bound-v1. Request proofs hide the note identity, exact balance and state signature. Withdrawal proofs expose the note id, destination, final balance and nullifier. The published circuit-specific keys were generated in a single-party setup. Retained setup secrets can allow forged proofs.
```

```diff
+   Status: CREATED
    contract Bn254Poseidon (eth:0xc6B55e86668d8c446B3D81273AAb9CBb20F28c7f) [zkapi/Bn254Poseidon]
    +++ description: Linked Poseidon hash library used by the vault for active-note leaves and Merkle updates. Its BN254 parameters must agree with the request and withdrawal circuits.
```
