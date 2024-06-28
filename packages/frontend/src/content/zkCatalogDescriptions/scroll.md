Scroll utilizes the [Halo2](https://zcash.github.io/halo2/index.html) proof system but modified to use KZG commitments instead of IPA commitments. The scheme makes use of the alt_bn128’s field. The prover code can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/develop/prover).

The protocol makes use of proof aggregation. Documentation for the aggregation architecture can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/develop/aggregator). The system doesn’t implement data compression yet.

The final proof is not wrapped in a different proof system. The CRS used is the powersOfTau25_hez_final and the instructions to regenerate the verification keys can be found [here](https://github.com/scroll-tech/scroll-prover#verifier-contract).

The differences between the zkEVM and the EVM are listed [here](https://docs.scroll.io/en/developers/ethereum-and-scroll-differences/). The source code of the base circuit can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/v0.9/zkevm-circuits) and the source code of the aggregation circuits can be found [here](https://github.com/scroll-tech/zkevm-circuits/tree/v0.9/aggregator).

The system utilizes two verifiers, one to be used with calldata as DA (v0.9.5) and the other with blobs as DA (v0.10.3).
