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

2. Clone [sp1 repo](https://github.com/succinctlabs/sp1), set `SP1_ALLOW_DEPRECATED_HOOKS` for correct compilation and run the script to build groth16 circuit file.

```
git clone https://github.com/succinctlabs/sp1.git
cd sp1/crates/prover
git checkout v6.1.0   # commit should be d454975ac7c1126097e36eceda9bce2cb9899da4
export SP1_ALLOW_DEPRECATED_HOOKS=true  # fixes compilation errors

make build-circuits
```

This script will generate `groth16_circuit.bin` file in the `prover/build/groth16` directory, however it will not generate correct prover and verifier keys.

3. Generate correct pk and vk using the correct SP1 trusted setup. This will require [semaphore-gnark-11](https://github.com/succinctlabs/semaphore-gnark-11/tree/main) repo.

```
cd
git clone https://github.com/succinctlabs/semaphore-gnark-11.git  # tested on commit hash 6d6ebc3608e609ec879e9ba99abee6b6b97d937d
cd semaphore-gnark-11
# Download the trusted setup transcript
curl "https://sp1-circuits.s3-us-east-2.amazonaws.com/v6.1.0-trusted-setup.tar.gz" -o trusted-setup.tar.gz

# Extract trusted setup transcript.
tar -xzf trusted-setup.tar.gz

# Build the binary.
go build

# Generate keys. They are outputted to the files pk and vk in the root directory.
./semaphore-gnark-11 key trusted-setup/phase1 trusted-setup/phase2-17 trusted-setup/evals /path/to/sp1/crates/prover/build/groth16/groth16_circuit.bin
```
The last step will take several hours to complete.

4. Compute the hash of generated `vk` file: `shasum vk -a 256`.
