The regeneration process consumed around 70 GiB of memory on the peak.

1. Install necessary dependencies: rust, docker, sp1 toolkit, go.

```
sudo apt update
sudo apt install build-essential golang-go protobuf-compiler

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
cargo install --debug --locked cargo-make

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker ${USER}

curl -L https://sp1up.succinct.xyz/ | bash
source ~/.bashrc
sp1up
```

2. Clone [sp1 repo](https://github.com/succinctlabs/sp1), set `SP1_ALLOW_DEPRECATED_HOOKS` for correct compilation and run the script to regenerate verifiers.

```
git clone https://github.com/succinctlabs/sp1.git
cd sp1/crates/prover
git checkout v6.0.0   # commit should be f87f8d6ff005d542db22e241928319f5e96a4609
export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors

make build-circuits
```

The script will generate Plonk verifier smart contract with verification keys and the verifier hash in `build/plonk` dir.
