Privacy Pools uses two Groth16 circuits — `commitment` (named `ragequit` in the trusted-setup ceremony) and `withdraw` — whose verification keys are hard-coded in the deployed `CommitmentVerifier.sol` and `WithdrawalVerifier.sol` smart contracts. This regeneration attests that these onchain verification keys correspond to the circuits published in the Privacy Pools repo.

Generally, to regenerate the two Privacy Pools verification keys, the following has to be done:

1. Checkout the `v1.2.1` tag of the [Privacy Pools core repo](https://github.com/0xbow-io/privacy-pools-core/tree/v1.2.1) (commit hash `a80836a47451e662f127af17e11430ffa976c234`).
2. Install the repo-pinned toolchain and compile the `.circom` circuit sources into `.r1cs` binaries.
3. Download the phase 1 trusted setup file `ppot_0080_16.ptau` (Perpetual Powers of Tau contribution #80), which underlies the ceremony final keys.
4. Verify the checked-in final prover keys (`.zkey`) against the compiled circuits and the phase 1 file. This step also implicitly checks the integrity of the phase 2 trusted setup.
5. Export verification keys from the final prover keys and make sure they are identical to the checked-in `.vkey` files, whose values are hard-coded in the onchain verifier smart contracts.

Helper scripts that implement the flow above and more detailed explanations could be found in this [script .zip archive](https://trusted-setup-hosting.l2beat.com/privacy/privacy-pools/verification_privacy_pools.zip). This .zip must be extracted in the `privacy-pools-core` dir checked out on tag `v1.2.1` (commit hash `a80836a47451e662f127af17e11430ffa976c234`) before the execution.
