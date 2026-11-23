Circuit-specific Phase 2 trusted setup for Hinkal's 15 Groth16 circuits over the BN254 curve:
`MainEVMCircuit` in 14 sizes (tokens × inputs × outputs) and `MainEVMCircuitMin`. It builds on the
Hermez ceremony as Phase 1. The `powersOfTau28_hez_final` files contain 54 Perpetual Powers of Tau
participant contributions and one public randomness beacon. 

No transcript or participant list for Phase 2 was published. Hinkal's documentation only says
that it runs a per-circuit setup. Each of the 15 proving keys that Hinkal's apps download holds exactly one
Phase 2 contribution, named "1st Contributor Name" (the example name in the snarkjs README), and no
beacon. Anyone who knows the Phase 2 contribution can forge proofs for every circuit.

- Phase 1 file description (54 contributions and a beacon): <https://github.com/iden3/snarkjs#7-prepare-phase-2>.
- Hinkal's description of its setup: <https://hinkal-team.gitbook.io/hinkal/technical-description/setup/cryptographic-primitives>
- Circuits: [Hinkal-Contracts-Circuits/circuits](https://github.com/Hinkal-Protocol/Hinkal-Contracts-Circuits/tree/61b6839aa80fc0c33bfdcde0323753c83cb2ce67/circuits)
- Proving keys, e.g. [mainEVMCircuit1x2x1_final-4.zkey](https://wallet-prodv12.hinkal.io/verifiers-v4/mainEVMCircuit1x2x1_final-4.zkey). The URLs of all 15 are listed in `constant.mjs` of [@hinkal/common 0.4.1](https://www.npmjs.com/package/@hinkal/common/v/0.4.1?activeTab=code).
