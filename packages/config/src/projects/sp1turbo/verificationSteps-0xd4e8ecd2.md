The regeneration process consumed around 50 GiB of memory on the peak. Also, due to some os indeterminism, 
the sp1 repo must be cloned into `/home/aurel/dev/sp1-wip/` directory, so we recommend creating `aurel` user on an Ubuntu 24.04 machine.

1. Create a new `aurel` user on a linux os and login as this user.
2. Install necessary dependencies: rust, sp1 toolkit, go.

```
sudo apt update
sudo apt install build-essential golang-go

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
cargo install --debug --locked cargo-make

curl -L https://sp1up.succinct.xyz/ | bash
sp1up
```

3. Clone sp1 repo in the correct directory, set `SP1_ALLOW_DEPRECATED_HOOKS` for correct compilation and run the script to regenerate verifiers.

```
mkdir -p dev/sp1-wip/
cd dev/sp1-wip/
git clone https://github.com/succinctlabs/sp1.git
cd sp1/crates/prover
git checkout v5.0.0   # commit should be 38f0f143dece864e8bffafad64196a924f190336
export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors

make build-circuits
```

The script will generate Plonk verifier smart contract with verification keys and the verifier hash in `build/plonk` dir.
