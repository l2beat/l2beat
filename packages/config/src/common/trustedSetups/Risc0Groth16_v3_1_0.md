Trusted setup 2026-10-20.1 for the Groth16 wrapper of the Risc0 v3.1.0 STARK verify circuit. The deployed `RiscZeroGroth16Verifier` v3.1.0 uses its verifying key.

Phase 1 uses `ppot_0080_23.ptau` from the [Perpetual Powers of Tau ceremony](https://github.com/privacy-ethereum/perpetualpowersoftau). It contains 61 participant contributions and one public randomness beacon. The verifying key's alpha equals the one in that file.

Phase 2 is published only as the final proving key, which the v3.1.0 prover image downloads. Its transcript holds two entries: a contribution named "1st Contributor Name" and a beacon named "Final Beacon phase2" with the fixed value `0x0102…1f` and 2^10 iterations. Both names and the beacon value are the placeholders of the ceremony script in the risc0 repository. No ceremony announcement, contributor list or attestation is published.

To check the transcript and the deployed key:

1. Download `stark_verify_final.zkey.gz` (sha256 `b69993d9dbb22e6c064b1f1b75da6e176c983e23d9b308664b91188f0479abf8`) and decompress it.
2. Run `snarkjs zkey verify stark_verify.r1cs ppot_0080_23.ptau stark_verify_final.zkey` to list the contributions. It needs about 32 GiB of memory.
3. Run `snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol` and compare its constants with the deployed verifier.

- Proving key used by the v3.1.0 prover image: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/docker/prover.Dockerfile#L56>.
- Ceremony script with the placeholder name and beacon: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/scripts/run_ceremony.sh>.
- Phase 1 file: <https://pse-trusted-setup-ppot.s3.eu-central-1.amazonaws.com/pot28_0080/ppot_0080_23.ptau>.
- Advisory that introduced the setup: <https://github.com/risc0/risc0/security/advisories/GHSA-g6qg-9j8p-7j87>.
