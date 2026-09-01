## Description

RISC Zero is the first zkVM proving RISC-V ISA programs. Its STARK proving system is based on a rather standard theoretical construction of [Ben-Sasson et al paper](https://eprint.iacr.org/2018/046) and [DEEP-ALI version of FRI](https://eprint.iacr.org/2019/336). The proof of zkVM execution is wrapped in Groth16 SNARK for efficient onchain verification. RISC Zero onchain verifier targets [96 bits of security](https://dev.risczero.com/api/security-model#cryptographic-security).

## Proof system

### RISC-V circuit

RISC Zero implements a [circuit that proves RISC-V RV32IM instruction set](https://github.com/risc0/risc0/tree/main/risc0/circuit/rv32im) (see [here](https://dev.risczero.com/api/zkvm/zkvm-specification#the-zkvm-execution-model) for more details). Arithmetization of this circuit has different types of columns: control, data and accumulator. Control columns contain public data that describes the RISC-V program being executed and proven. Data and accumulator columns contain private data (accessible only to prover), data represents the running state of the processor and memory and accumulator is auxiliary data for the PLOOKUP argument.

### Recursion circuit

RISC Zero prover supports recursive proving of RISC-V programs using [recursion circuit](https://github.com/risc0/risc0/tree/main/risc0/circuit/recursion). This is a separate STARK circuit that is designed to efficiently generate proofs for the verification of STARK proofs, it uses the same proving system as the RISC-V circuit.

Big programs are split into several segments that are executed and proven in parallel. Segment receipts (i.e. proofs of correct execution) are verified with recursion circuits and succinct receipts are produced. These succinct receipts could be recursively joined in pairs of two until a single succinct proof of the whole execution is produced. 

### Final wrap

RISC Zero [implements a SNARK wrapping](https://github.com/risc0/risc0/tree/main/risc0/groth16) of a recursive succinct receipt into a Groth16 proof over BN254 curve for onchain verification. This Groth16 R1CS circuit uses a circuit-specific trusted setup, the ceremony was run by RISC Zero, see [below](#trusted-setups) for more details. 

The final wrap circuit has a [control root](https://dev.risczero.com/terminology#control-root) public input that depends on the RISC-V and recursion circuit versions. This design allows upgrading RISC Zero proving system without changing the final wrapper and thus without running a new trusted setup ceremony.
