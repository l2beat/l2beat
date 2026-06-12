We performed the following steps, which according to the Succinct team should have lead to a successful regeneration of the verifier's hash.
However these steps produced a verifier smart contract with `VERIFIER_HASH = 0xf7ba6320608dadd905f3483d51c2fa0fb55473e3136bdfb37c96a10f158ab9fe`, which differs from the value onchain.        

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
