Trusted setup 2026-10-20.1 for the Groth16 wrapper of the Risc0 v3.1.0 STARK verify circuit. The deployed `RiscZeroGroth16Verifier` v3.1.0 uses its verifying key, which was changed after identifying a critical vulnerability in the older version.

Phase 1 uses `ppot_0080_23.ptau` from the [Perpetual Powers of Tau ceremony](https://github.com/privacy-ethereum/perpetualpowersoftau). It contains 61 participant contributions and one public randomness beacon. The verifying key's alpha equals the one in that file.

RISC Zero publishes the final proving key, which the v3.1.0 prover image downloads, and its own `snarkjs zkey verify` output. Both list two phase 2 entries: a contribution named "1st Contributor Name" and a beacon named "Final Beacon phase2" with the fixed value `0x0102…1f` and 2^10 iterations. Both names and the beacon value are the placeholders of the ceremony script in the risc0 repository. No ceremony announcement, contributor list or attestation is published.

- Proving key used by the v3.1.0 prover image, and the Circom build: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/docker/prover.Dockerfile>.
- Ceremony script with the placeholder name and beacon: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/scripts/run_ceremony.sh>.
- Phase 1 file: <https://pse-trusted-setup-ppot.s3.eu-central-1.amazonaws.com/pot28_0080/ppot_0080_23.ptau>.
- Proving key: <https://artifacts.risczero.net/zkey/2026-10-20.1/stark_verify_final.zkey.gz>.
- Advisory that introduced the setup: <https://github.com/risc0/risc0/security/advisories/GHSA-g6qg-9j8p-7j87>.
