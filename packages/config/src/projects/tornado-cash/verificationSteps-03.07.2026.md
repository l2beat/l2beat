This regeneration attests that the verifier smart contract verification keys correspond to circuits published in Tornado Cash release.

Generally, to regenerate Tornado Cash verifier, the following has to be done:

1. Checkout the correct branch of the sources: `https://github.com/tornadocash/tornado-core/tree/v2.1`.
2. Compile the `.circom` circuit sources into `.json`.
3. Fetch published prover keys for `tornado.params`. This file contains the circuit information and Groth16 phase 2 trusted setup information (final evaluation keys for all 1114 contributions). It does not contain phase 1 trusted setup data, which must be fetched separately.
4. Check that `tornado.params` was generated with the same compiled circuit as was obtained in step 2. This step will implicitly check the integrity of phase 2 trusted setup, and it will rely on the separately fetched phase 1 trusted setup files.
5. Generate verification keys from the prover key and make sure that it is identical to the one in the solidity smart contract.

Helper scripts that implement the flow above and more detailed explanations could be found in this [script .zip archive](https://trusted-setup-hosting.l2beat.com/privacy/tornado-cash/verification_tornado_cash.zip). This .zip must be extracted in `tornado-core` dir checked out on tag `v2.1` (commit hash `a533ad9ffb62163a42d4fa9a09984c5dd4e5c41d`) before the execution.
