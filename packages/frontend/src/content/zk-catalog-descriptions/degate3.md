DeGate utilizes groth16 for their proving system.

Since groth16 requires a circuit-specific trusted setup, DeGate run their own ceremony. Some of the instructions to regenerate the verification keys can be found [here](https://github.com/degatedev/trusted_setup/tree/master).

The protocol doesn’t make use of proof aggregation techniques.

The source code of the circuits can be found [here](https://github.com/degatedev/protocols/tree/degate_mainnet/packages/loopring_v3/circuit).