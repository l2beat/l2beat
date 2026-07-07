Railgun smart contract acts as a verifier for ZK proofs for all 91 Railgun circuits. 91 different verification keys for these circuits are stored onchain in the verifier smart contract. This regeneration attests that the verification keys stored onchain correspond to circuits published in Railgun repo.

Generally, to regenrate all Railgun verification keys, the following has to be done:

1. Checkout the `main` branch of the [Railgun circuits-v2 repo](https://github.com/Railgun-Privacy/circuits-v2) (commit hash `0aa2d13763a9fcfbb7b7ea9c02e004e71f1394bb`).
2. Download Railgun trusted setup artifacts, which could be found at IPFS CID `QmUsmnK4PFc7zDp2cmC4wBZxYLjNyRg Wfs5GNcJJ2uLcpU` or [on L2BEAT trusted setup hosting](https://trusted-setup-hosting.l2beat.com/privacy/railgun/trusted_setup_railgun.zip). It contains the proving keys for all 91 circuits, which contain circuit information and Groth16 phase 2 trusted setup information.
3. Build required version of circom and compile circuit sources into `.r1cs` binaries.
4. Download the phase 1 trusted setup files and use it to verify that all published prover keys correspond to the compiled circuits. This step will implicitly check the integrity of phase 2 contributions.
5. Generate all 91 verification keys from all prover keys, and make sure that it is identical to the ones in the onchain smart contract.

Helper scripts that implement the flow above and more detailed explainations could be found in this [script .zip archive](https://trusted-setup-hosting.l2beat.com/privacy/railgun/verification_railgun.zip). This .zip must be extracted in `circuits-v2` dir checked out on commit `0aa2d13763a9fcfbb7b7ea9c02e004e71f1394bb` before the execution.