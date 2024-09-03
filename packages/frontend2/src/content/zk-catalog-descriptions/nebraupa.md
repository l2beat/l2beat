Nebra UPA is a universal proof aggregator for Groth16 circuits. The architecture is composed of three parts:

- The outer circuit, capable of verifying multiple UBV proofs at once;
- The Universal Batch Verifier (UBV) circuit, capable of verifying multiple Groth16 proofs at once;
- The Keccak circuit, used to computed IDs.

The three circuits can be found [here](https://github.com/NebraZKP/upa/tree/v1.2.2/circuits). The prover tool can be found [here](https://github.com/NebraZKP/upa/tree/v1.2.2/prover).

The guide on how to regenerate the onchain verifiers can be found [here](https://github.com/NebraZKP/upa/tree/v1.2.2/verification).
