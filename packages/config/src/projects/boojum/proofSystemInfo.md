## Description

Boojum is a proving system operating on [EraVM](https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/12_alternative_vm_intro.html) ISA and supporting [zk stack](https://zkstack.io) chains. It includes recursive STARK proving of zkVM execution, as well as the final wrap with [Plonk](https://github.com/matter-labs/franklin-crypto/tree/dev/src/plonk) or [Fflonk](https://github.com/matter-labs/zksync-crypto/blob/main/crates/fflonk/docs/spec.pdf) SNARK proving system. Boojum targets [100 bits of security](https://github.com/matter-labs/era-boojum?tab=readme-ov-file#for-curions-in-benchmarks-only).

## Proof system

### zkVM component

[Boojum](https://github.com/matter-labs/era-boojum/tree/main)'s core is an implementation of the [**Redshift**](https://eprint.iacr.org/2019/1400.pdf) protocol which uses the Plonk IOP with a polynomial commitment scheme based on List Polynomial Commitments (LPCs), which is in turn based on FRI, making the scheme transparent. The scheme makes use of the Goldilocks field, which is much smaller than BN254's field. This part of boojum implements a zkVM for EraVM, which is closely aligned with EVM but has essential differences like 16 registers.

### Recursion circuits

The protocol makes use of several layers of recursive proof aggregation for 15 types of [circuits](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L29). In particular, node and scheduler circuits aggregate zk proofs and compressor and wrapper circuits reduce the final proof size. Further information about the aggregation architecture can be found [**here**](https://github.com/matter-labs/zksync-era/blob/1b61d0797062ab8b0aa2c1e92b23a3a0d8fd2c61/docs/guides/advanced/15_prover_keys.md#circuits).

### Final wrap

The final proof could either be wrapped into a [Plonk](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs)+KZG proof, or into [Fflonk](https://github.com/matter-labs/zksync-crypto/tree/main/crates/fflonk)+KZG for cheap verification. The KZG commitment is done over BN254 curve and it uses Aztec Ignition trusted setup ceremony, see [below](#trusted-setups) for more details.
