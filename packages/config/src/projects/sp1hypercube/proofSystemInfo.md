## Description

SP1 Hypercube is the latest Succint's RISC-V zkVM using the [Plonky3](https://github.com/Plonky3/Plonky3) stack. The zkVM execution is proven recursively and is wrapped into a SNARK for final verification. It provides tools to generate onchain Groth16 or Plonk verifiers. SP1 Hypercube provides 98 bits of proven security, as per [Ethereum Foundation’s soundcalc evaluation](https://github.com/ethereum/soundcalc/blob/main/reports/sp1.md).

## Proof system

SP1 Hypercube is an iteration of the previous zkVM version, SP1 Turbo, introducing architectural changes that improve prover performance and memory efficiency.

Hypercube proves execution of a 64-bit RISC-V VM using several ZK circuits, or chips, connected by lookup arguments ([LogUp based on GKR protocol](https://docs.succinct.xyz/docs/sp1/hypercube/logupgkr)). VM execution trace is split into several shards of size approximately 2^22, that could be proven in parallel with a STARK proving system. Additional arguments prove memory consistency across shards. 

The parallelized proofs are recursively checked by the next layer of STARK circuits. The correctness of the final STARK proof is verified with the final wrap SNARK program, the wrap SNARK proof is verified onchain.

### Hypercube vs. Turbo

Proving time and memory optimizations of SP1 Hypercube are based on several design improvements compared to SP1 Turbo.

Hypercube implements a [multilinear polynomial](https://github.com/succinctlabs/sp1/tree/v6.0.0/slop/crates/multilinear) STARK compared to univariate polynomials in Turbo. Multilinear polynomial based proving systems are more efficient than univariate because manipulating them reduces usage of log-linear FFT algorithm.

Multilinear polynomials also allow Hypercube to innovate on a polynomial commitment scheme, implementing [Jagged PCS](https://docs.succinct.xyz/docs/sp1/hypercube/jagged) (defined in [this preprint](https://eprint.iacr.org/2025/917)). Jagged PCS allows efficient packing of computation traces of zkVM chips with different lengths, optimizing the prover memory requirement. More efficient LogUp based on GKR is also made possible because of multilinear polynomials.

### Recursion circuits

SP1 Hypercube provides tools for recursive proof generation by [verifying proofs in a zkVM](https://docs.succinct.xyz/docs/sp1/writing-programs/proof-aggregation#verifying-proofs-inside-the-zkvm). This uses the same toolkit as top-level proof system, but proves the correct verification of all proofs generated on the previous step.

First, proofs for correctness of separate shards are generated. These shards may have different trace shape, so in the next step they are normalized. Finally, normalized shard proofs are recursively compressed in batches of 3-4 to a single zkVM proof. For further details see [this page](https://docs.succinct.xyz/docs/sp1/hypercube/recursion).

### Final wrap

SP1 Hypercube supports Plonk (with KZG polynomial commitments) or Groth16 final SNARK wrap of the STARK proof for performant onchain proof verification ([link](https://docs.succinct.xyz/docs/sp1/generating-proofs/proof-types#compressed)). The <https://github.com/Consensys/gnark> implementation of these proof systems over BN254 curve is used. For Plonk, Aztec Ignition trusted setup ceremony is used, for Groth16 Succinct run internal circuit-dependent phase 2 trusted setup (todo: link to trusted setups section).
