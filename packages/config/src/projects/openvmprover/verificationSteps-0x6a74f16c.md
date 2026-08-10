The verification steps are based on [this guide](https://github.com/scroll-tech/scroll-sc-tools/tree/feat/galileo?tab=readme-ov-file), with slight adjustments to resolve build failures. Memory usage peaks around 80 GiB on an ubuntu machine.

1. Install dependency packages: `sudo apt-get update && sudo apt-get install build-essential pkg-config libssl-dev`.
2. Install specifically required rust toolchain, solidity compiler and forge toolchain:
```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
rustup toolchain install nightly-2025-02-14

cargo install svm-rs
svm install 0.8.19
solc --version  # should be 0.8.19

curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc    # or similar depending on your shell
foundryup
```
3. Check out the correct version of the [scroll-sc-tools](https://github.com/scroll-tech/scroll-sc-tools) repo: `git checkout 8658047684eedff2d6f9071264989f7e6f5b1f14`.
4. Modify the script to download all required trusted setup params: line 8 of `scripts/download-params.sh` should be changed to `degrees=("22" "23" "24")`.
5. Download trusted setup params (around 4 GiB): `bash scripts/download-params.sh`.
6. Generate the verifier file and output its code hash: `RUST_MIN_STACK=16777216 cargo run --release -- generate-verifier --recompute`.
7. Verify that the deployed verifier smart contract has the same codehash: `cast keccak $(cast code 0x96cbcC4333E172927fDa8B631C716d43E2FBA01C --rpc-url <YOUR_ETHEREUM_RPC_URL>)`.
