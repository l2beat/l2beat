## Description

SP1 Turbo is a RISC-V zkVM using the [Plonky3](https://github.com/Plonky3/Plonky3) stack. The zkVM execution is proven recursively and is wrapped into a SNARK for final verification. It provides tools to generate onchain Groth16 or Plonk verifiers. SP1 targets [100 bits of security based on unproven proximity gaps conjecture](https://docs.succinct.xyz/docs/v5/sp1/security/security-model#conjectures-for-fris-security), so the actual security is likely lower.

## Proof system

SP1 Turbo proves execution of a 32 bit RISC-V VM (RV32IM) using several ZK circuits connected by lookup arguments, as implemented in Plonky3. VM execution trace is split into several chunks that could be proven in parallel with a STARK proving system. The parallelized proofs are recursively checked by the next layer of STARK circuits. The correctness of the final STARK proof is verified with the final wrap SNARK program, the wrap SNARK proof is verified onchain.

### zkVM component

Verifies execution of a RISC-V program in a zkVM. See [here](https://docs.succinct.xyz/docs/v5/sp1/security/rv32im-implementation) for more details on the exact RISC-V standard implemented. Uses [Plonky3](https://github.com/Plonky3/Plonky3) STARK toolkit with AIR arithmetization and FRI-based polynomial commitment scheme within the [BabyBear field](https://docs.succinct.xyz/docs/v5/sp1/security/security-model#hash-functions-and-the-random-oracle-model).

### Recursion circuits

SP1 provides tools for recursive proof generation by [verifying proofs in a zkVM](https://docs.succinct.xyz/docs/v5/sp1/writing-programs/proof-aggregation#verifying-proofs-inside-the-zkvm). This uses the same toolkit as top-level proof system, but proves the correct verification of all proofs generated on the previous step.

### Final wrap

SP1 supports Plonk (with KZG polynomial commitments) or Groth16 final SNARK wrap of the STARK proof for performant onchain proof verification ([link](https://docs.succinct.xyz/docs/v5/sp1/generating-proofs/proof-types#compressed)). The [gnark](https://github.com/Consensys/gnark) implementation of these proof systems over BN254 curve is used. For Plonk, Aztec Ignition trusted setup ceremony is used, for Groth16 Succinct run internal circuit-dependent phase 2 trusted setup, see [below](#trusted-setups) for more details.
