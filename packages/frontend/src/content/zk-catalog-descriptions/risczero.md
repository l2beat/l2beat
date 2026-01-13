RISC Zero allows to prove with ZK the computation of a RISC-V program. The architecture is composed of three parts:

- The RISC-V circuit;
- The aggregation circuit;
- The STARK to SNARK wrapper.

The repo containing the circuits code can be found [here](https://github.com/risc0/risc0/tree/main). The prover implementation can be found [here](https://github.com/risc0/risc0/blob/main/risc0/zkp/src/prove/prover.rs).

The wrapper uses Groth16 as the proof system, and therefore requires a circuit specific trusted setup. The ceremony can be found [here](https://ceremony.pse.dev/projects/RISC%20Zero%20STARK-to-SNARK%20Prover). A guide on how to verify the setup can be found in the docs [here](https://dev.risczero.com/api/trusted-setup-ceremony).

Info about the security model can be found [here](https://dev.risczero.com/api/security-model), the list of audits [here](https://github.com/risc0/rz-security/tree/main/audits) and other updates on the [RISC Zero blog](https://risczero.com/blog).
