Generated with discovered.json: 0x5824f3669b2887098bf63807d97bf138f6460e93

# Diff at Wed, 07 Oct 2026 11:42:45 GMT:

- id: 193c1624
- author: sekuba (<29250140+sekuba@users.noreply.github.com>)
- current timestamp: 1791373302

## Description

Initial discovery of the active native ETH vault, its Groth16 proof adapter and linked Poseidon library. All three contracts were verified from public source. The owner can pause new exits and change the treasury.

## Initial discovery

```diff
+   Status: CREATED
    contract ZkApiVault (eth:0x4386FDbdA35D995beB3BF8625118Ec5982ec81fe) [zkapi/ZkApiVault]
    +++ description: Escrows ETH for anonymous API authorizations as publicly numbered notes. A Groth16 proof closes a note with operator clearance, or starts a delayed escape that any request proof with the same nullifier cancels. Closing reveals the note id, payout address and remaining balance and sends the used part to the treasury. Anyone can sweep an expired note entirely to the treasury, also while paused.
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
