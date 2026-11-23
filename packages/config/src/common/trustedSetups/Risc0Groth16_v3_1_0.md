Trusted setup 2026-10-20.1 for the Groth16 wrapper of the Risc0 v3.1.0 STARK verify circuit. The deployed `RiscZeroGroth16Verifier` v3.1.0 uses its verifying key. Earlier verifiers, up to v3.0.0, use the 2024 setup with 238 phase 2 participants, and RISC Zero has stopped all of them.

Phase 1 uses `ppot_0080_23.ptau` from the [Perpetual Powers of Tau ceremony](https://github.com/privacy-ethereum/perpetualpowersoftau). It contains 61 participant contributions and one public randomness beacon. The verifying key's alpha equals the one in that file.

RISC Zero publishes the final proving key, which the v3.1.0 prover image downloads, and its own `snarkjs zkey verify` output. Both list two phase 2 entries: a contribution named "1st Contributor Name" and a beacon named "Final Beacon phase2" with the fixed value `0x0102…1f` and 2^10 iterations. Both names and the beacon value are the placeholders of the ceremony script in the risc0 repository. No ceremony announcement, contributor list or attestation is published.

To check the transcript and the deployed key:

1. Check out [risc0](https://github.com/risc0/risc0) at tag `v3.1.0` (commit `22c5fb90522cb4d9427d4af6c05e747d20be2b7f`) and fetch the circuit with `git lfs pull --include=groth16_proof/groth16/stark_verify.circom`.
2. Build Circom 2.2.2 from commit `e410b0d5cd2948a15931df0bc50d79ce56fa8c32` of [iden3/circom](https://github.com/iden3/circom) with `cargo install --locked --path circom`.
3. Compile the circuit as the prover image does: from `groth16_proof/groth16` run `circom --r1cs --c --O2 --no_asm stark_verify.circom`.
4. Download `ppot_0080_23.ptau` and `stark_verify_final.zkey.gz` (sha256 `b69993d9dbb22e6c064b1f1b75da6e176c983e23d9b308664b91188f0479abf8`), both linked below, and decompress the zkey.
5. Run `snarkjs zkey verify stark_verify.r1cs ppot_0080_23.ptau stark_verify_final.zkey`. It needs about 32 GiB of memory and lists the contributions with circuit hash `ba40e9ac…`.
6. Run `snarkjs zkey export solidityverifier stark_verify_final.zkey verifier.sol` and compare its constants with the deployed verifier.

- Proving key used by the v3.1.0 prover image, and the Circom build: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/docker/prover.Dockerfile>.
- RISC Zero's `snarkjs zkey verify` output: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/groth16/zkey_verify_2026-10-20.1.txt>.
- Ceremony script with the placeholder name and beacon: <https://github.com/risc0/risc0/blob/22c5fb90522cb4d9427d4af6c05e747d20be2b7f/groth16_proof/scripts/run_ceremony.sh>.
- Phase 1 file: <https://pse-trusted-setup-ppot.s3.eu-central-1.amazonaws.com/pot28_0080/ppot_0080_23.ptau>.
- Proving key: <https://artifacts.risczero.net/zkey/2026-10-20.1/stark_verify_final.zkey.gz>.
- Advisory that introduced the setup: <https://github.com/risc0/risc0/security/advisories/GHSA-g6qg-9j8p-7j87>.
