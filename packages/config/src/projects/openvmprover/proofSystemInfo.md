## Description

[OpenVM](https://github.com/openvm-org/openvm?tab=readme-ov-file) is a STARK proving system based on [Plonky3 proving library](https://github.com/Plonky3/Plonky3), that has “no-CPU” design paradigm and allows adding new custom instructions to its instruction set architecture (ISA). It supports [recursive STARK aggregation](https://docs.openvm.dev/book/guest-libraries/verify-stark) and provides an [SDK](https://github.com/openvm-org/openvm-solidity-sdk) for creating Solidity verifier smart contracts. 

## Proof system

The proof system is split into ZK frontend, i.e. arithmetization, and ZK backend, i.e. a polynomial IOP with the Fiat-Shamir heuristic. In practice, a batched FRI-based polynomial commitment is used as the backend. OpenVM backend relies on Plonky3 prover system.

OpenVM arithmetizes the execution trace using AIR with Interactions over BabyBear prime field. Interactions which include LogUp, permutation check and others.

### zkVM design

OpenVM uses read-only program memory, read/write data memory as well as inputs and hints from host to enable non-deterministic computation. The execution logic is organized into a set of system chips and custom chips, without any centralized CPU-like chip. Interactions between chips are managed by program, execution and memory buses.

Currently OpenVM ISA supports RISC-V instructions, keccak-256 and SHA256 hash functions, int256 arithmetic, modular arithmetic over arbitrary fields, some elliptic curve operations for the secp256k1 and secp256r1 curves and pairing operations on the BN254 and BLS12-381 curves.

### Recursion circuits

OpenVM supports recursive proving and continuations, i.e. splitting a single execution trace into several rather independent ones, by recursive verification of generated STARK proofs in a specialized OpenVM program optimized for efficient proof verification (called native VM).

### Final wrap

The STARK proof is wrapped in Halo2 SNARK with KZG commitments over BN254 curve for efficient onchain processing. KZG commitment relies on Perpetual Powers of Tau trusted setup ceremony, see [below](#trusted-setups) for more details.
