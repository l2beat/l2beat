The verification steps are based on [this guide](https://github.com/scroll-tech/scroll-sc-tools/tree/feat/galileo?tab=readme-ov-file), with slight adjustments to resolve build failures. Memory usage peaks around 50 GiB on an ubuntu machine.

1. Install dependency packages: `sudo apt-get update && sudo apt-get install build-essential pkg-config libssl-dev`.
2. Install specifically required rust toolchain and solidity compiler:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
rustup toolchain install nightly-2025-02-14

cargo install svm-rs
svm install 0.8.19
solc --version  # should be 0.8.19
```
3. Check out the correct version of the [scroll-sc-tools](https://github.com/scroll-tech/scroll-sc-tools) repo: `git checkout feat/galileo`. The commit hash should be `f880a705954dc205cae7e1add474bd9e6cad1610`.
4. Modify the script to download all required trusted setup params: line 8 of `scripts/download-params.sh` should be changed to `degrees=("22" "23" "24")`.
5. Download trusted setup params (around 4 GiB): `bash scripts/download-params.sh`.
6. Generate the verifier file and output its code hash: `RUST_MIN_STACK=16777216 cargo run --release -- generate-verifier --recompute`. If this step produces a build failure because of `SOLC_VERSION_0_8_31_CHECKSUM` duplication, open the problematic `builds.rs` file and remove all occurances of the duplicate (second version of `SOLC_VERSION_0_8_31_CHECKSUM`). This requires altering several lines, including changing the hardcoded length of `ALL_SOLC_VERSIONS` array. Rerun the command after altering the file.
7. Verify that the deployed verifier smart contract has the same codehash: `cast keccak $(cast code 0x749fC77A1a131632a8b88e8703E489557660C75e --rpc-url <YOUR_ETHEREUM_RPC_URL>)`.
