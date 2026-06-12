## Description

zkProver is a STARK proving system designed to implement the zkEVM component of Polygon zkEVM. It proves the execution of EVM transactions in a zkVM running on [zkASM](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/#zero-knowledge-assembly) ISA. zkProver allows recursive STARK aggregation as well as the final wrap in a [Fflonk](https://hecmas.github.io/events/2023fflonk/) SNARK for efficient onchain verification. zkProver onchain verifier targets 128 bits of security.

## Proof system

zkProver toolkit introduces two new domain specific languages: zkASM and PIL. zkASM is the instruction language of the internal zkVM, and the execution of EVM transactions is proven with a specific zkASM program called [ROM](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/main-state-machine/#the-rom). PIL is a language for creating circuits, conceptually similar to [circom](https://docs.circom.io).

zkProver is based on [eSTARK paper](https://eprint.iacr.org/2023/474), meaning that it implements a FRI-based STARK with AIR arithmetization extended with additional arguments. It also [provides tools](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/stark-recursion/composition-recursion-aggregation/#setup-phase) to automatically generate circom arithmetic circuits for verifying the STARK proof, which plays an essential role in proof compression and recursive proving. 

### Polynomial Identity Language (PIL)

The polynomial constraints that define circuits within zkProver are specified using a language called [polynomial identity language](https://github.com/0xPolygon/pilcom) (PIL). PIL supports complicated and powerful polynomial constraints, like [permutation](https://docs.polygon.technology/tools/zkevm/spec/pil/permutation-arguments/), [inclusion](https://docs.polygon.technology/tools/zkevm/spec/pil/inclusion-arguments/) and [connection](https://docs.polygon.technology/tools/zkevm/spec/pil/connection-arguments/) arguments. PIL was designed to be applicable in other zk tools as well. The next iteration of PIL called PIL2 could be found [here](https://github.com/0xPolygonHermez/pil2-compiler).

### State machine

zkProver state machine (zkVM) consists of [13 separate state machines](https://github.com/0xPolygon/zkevm-prover/tree/main/src/sm) specified in PIL, including [main SM](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/main-state-machine/), [arithmetic SM](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/arithmetic-sm/), [binary SM](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/binary-sm/), etc. Each state machine creates its own execution trace, which is connected to the rest using connection argument. The state machine has access to EVM state trie, EVM memory and the ROM program that implements verification of EVM transactions in zkASM language. 

### Recursion circuits

[Proving architecture](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/stark-recursion/proving-architecture/) of zkProver consists of several stages. Compression stage reduces the size of STARK proofs of zkEVM batch execution for efficiency of further computations. Normalization stage prepares for aggregation by correctly aligning public inputs across several batches. Aggregation stage repeatedly joins pairs of STARK proofs to produce a single proof of multiple zkEVM batches. Final STARK stage changes the field over which the proof is generated to prepare for the SNARK wrap. Finally, SNARK stage produces a Fflonk proof to be posted onchain.

Each recursion step uses a circom R1CS arithmetic circuit to verify input PIL-STARK proofs (see [here](https://docs.polygon.technology/tools/zkevm/architecture/zkprover/stark-recursion/composition-recursion-aggregation/#stark-to-circuit-or-s2c-sub-process)). The proof of verification is a PIL-STARK that is generated on the Plonkish arithmetization of this circom circuit.
