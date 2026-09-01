## Description

Barretenberg is a C++ library that implements several Plonk-based proof systems, developed by Aztec. It notably includes UltraHonk SNARK as an optimized version of previous Plonk implementation, and CHONK (Client-side Highly Optimized ploNK) SNARK for client-side proving on weaker devices. Barretenberg implements actual zero-knowledge SNARK modifications that allow proving over private data, and provides tools to generate UltraHonk smart contract verifiers. It also contains circuits to prove private and public transactions on Aztec L2.

## Proof system

The main application of Barretenberg is proving Aztec L2 state transition, which includes users locally proving private transactions with true ZK CHONK and more powerful nodes proving public transactions using UltraHonk. CHONK proofs must be verified within UltraHonk, so Barretenberg also includes tools for recursive proving. Both proving systems operate on arithmetic circuits that could be compiled from [Noir](https://github.com/noir-lang/noir) programs into ACIR, which is a [native circuit representation for Barretenberg](https://barretenberg.aztec.network/docs/#relationship-with-noir). 

### UltraHonk

UltraHonk is built on top of [Plonk](https://eprint.iacr.org/archive/2019/953/1624533038.pdf) proof system, with several optimizations for performance. It also serves as a basis for CHONK. The main optimization comes from using sumcheck protocol over the boolean hypercube as described in the [HyperPlonk paper](https://eprint.iacr.org/2022/1355). This trick allows reducing prover time and memory requirements at the expense of larger proofs. Barretenberg also contains code for circuits [verifying Honk proofs within UltraHonk verifier](https://github.com/AztecProtocol/aztec-packages/tree/next/barretenberg/cpp/src/barretenberg/stdlib/honk_verifier), allowing prover recursion. For more technical details on UltraHonk see [here](https://github.com/AztecProtocol/aztec-packages/tree/99c1647e91c83a3b1b3e040fce481fb4c7265522/barretenberg/cpp/src/barretenberg/ultra_honk#readme).

### CHONK

CHONK is the proof system that is most optimized for client side proving in memory-restricted environments like mobile and browsers. In addition, CHONK has zero-knowledge property to protect prover private inputs, which is achieved by adding random masking polynomials at several stages of the pipeline and some other measures. For the full description of ZK-related modifications see [here](https://github.com/AztecProtocol/aztec-packages/tree/99c1647e91c83a3b1b3e040fce481fb4c7265522/barretenberg/cpp/src/barretenberg/ultra_honk#zero-knowledge).

One of CHONK’s key innovations is Goblin architecture that efficiently manages elliptic curve operations over BN254 used e.g. in signatures. Elliptic curve operations are collected in a queue during the circuit proving, but the proof of their correctness is deferred to the very end of the proving process. The final step of the proving is done over a different curve called Grumpkin, which is chosen to make these EC operations native (i.e. extremely efficient). The correctness of translation between BN254 and Grumpkin is handled by the [Translator VM](https://github.com/AztecProtocol/aztec-packages/blob/7d03c441df4935ec5b08069446f3e8d59966532e/barretenberg/cpp/src/barretenberg/translator_vm/README.md) and the correctness of EC operations is proven by the [ECCVM](https://github.com/AztecProtocol/aztec-packages/blob/7d03c441df4935ec5b08069446f3e8d59966532e/barretenberg/cpp/src/barretenberg/eccvm/README.md).

CHONK also introduces a folding scheme inspired by [HyperNova](https://eprint.iacr.org/2023/573) for more memory-efficient proving of recursive smart contract calls. In this case different smart contract are represented by different circuits, which are proven separately and then aggregated. The folding scheme allows efficient aggregation of these proofs that results in only one expensive polynomial commitment check in the end, instead of having to check it for each smart contract call.

For more technical details on CHONK see [here](https://github.com/AztecProtocol/aztec-packages/tree/7d03c441df4935ec5b08069446f3e8d59966532e/barretenberg/cpp/src/barretenberg/chonk#readme).

### Noir and trusted setups

Although not technically a part of Barretenberg proving repo, [Noir language](https://noir-lang.org) represents the most developer-friendly way to create circuits to be proven with UltraHonk or CHONK. It’s a domain-specific language inspired by Rust.

All Barretenberg proving systems extend Plonk, which is based on KZG commitment schemes. That requires a trusted setup, which is chosen to be Aztec Ignition trusted setup. Some internal proofs, like ECCVM proof, are based on IPA (inner product argument) and thus they require no trusted setup.
