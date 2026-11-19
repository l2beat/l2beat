Circuit-specific phase 2 trusted setups for the Groth16 verifiers of the Hinkal pool, over the BN254 curve. The pool uses its main circuit in 14 sizes, which differ in the number of tokens, inputs and outputs, and a minimal circuit for calls that move no notes. Each of the 15 has its own proving key and verifier.

Hinkal publishes no ceremony record: no transcript, no list of contributors and no statement of which Powers of Tau file phase 1 used. The proving keys the app downloads are the only record. Each of the 15 keys holds exactly one phase 2 contribution. Whoever made that contribution knows the secret behind the key unless they destroyed it, and with it can produce proofs for false statements, such as a withdrawal of funds they never deposited.

The verification key inside a proving key equals the constants of the verifier contract deployed for its circuit.

- Proving keys: `https://wallet-prodv12.hinkal.io/verifiers-v4/mainEVMCircuit<size>_final-4.zkey`, for the sizes 1x2x1, 1x2x2, 1x6x1, 1x6x2, 2x2x1, 2x2x2, 2x6x1, 2x6x2, 3x2x1, 3x6x1, 4x2x1, 4x6x1, 5x2x1, 5x6x1 and Min0.
- Contribution count: section 10 of a snarkjs proving key holds the circuit hash and the list of contributions. `snarkjs zkey verify` prints the same list when given the circuit and the Powers of Tau file.
- Circuits and verifier sources: [Hinkal-Contracts-Circuits at 61b6839](https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits/tree/61b6839aa80fc0c33bfdcde0323753c83cb2ce67).
