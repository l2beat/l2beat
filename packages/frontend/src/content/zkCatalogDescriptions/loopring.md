Loopring utilizes groth16 for their proving system.

Since groth16 requires a circuit-specific trusted setup, Loopring run [their own ceremony](https://github.com/Loopring/trusted_setup?tab=readme-ov-file). The first phase is run using powersOfTau18_hez_final as the CRS. Some of the instructions to regenerate the verification keys can be found [here](https://github.com/Loopring/trusted_setup).

The protocol doesn’t make use of proof aggregation techniques.

The source code of the circuits can be found [here](https://github.com/Loopring/protocol3-circuits.git).
