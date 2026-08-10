Verification steps below were done on a Linux machine and required ~64 GiB RAM. They are based on [this doc](https://github.com/ADI-Foundation-Labs/ADI-Stack-zkOS-Wrapper/blob/v0.5.4-b/docs/end_to_end.md).

1. Install specific rust toolchain, docker and several rust crates that are required by the build:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

rustup toolchain install nightly-2025-05-24
# RISC-V target
rustup target add riscv32i-unknown-none-elf --toolchain nightly-2025-05-24
# For objcopy
cargo install cargo-binutils
rustup component add llvm-tools-preview --toolchain nightly-2025-05-24

# one way to install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker ${USER}
```

2. Build the correct version of zksync OS RISC-V binary:

```
git clone https://github.com/matter-labs/zksync-os.git
cd zksync-os
git checkout v0.2.5     # commit hash should be 135013888f4ec0be3211dfd488050bbad8bd58c1

chmod +x zksync_os/reproduce/reproduce.sh
./zksync_os/reproduce/reproduce.sh
```

The script will build `multiblock_batch.bin` binary in `zksync_os` dir, verify that it is the correct one:
```
md5sum multiblock_batch.bin     # the output should be e77ced130723f3e52099658d589a8454
```

3. Download the trusted setup file required for the final wrap circuits:

```
curl https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_2\^24.key --output setup.key
```

4. Generate the correct Airbender wrapper PLONK from the built binary and trusted setup file:
```
git clone https://github.com/ADI-Foundation-Labs/ADI-Stack-zkOS-Wrapper
cd ADI-Stack-zkOS-Wrapper
git checkout v0.5.4-b   # commit hash be8fd7231c81c973349fcfa54303a257f7fa9408
mkdir -p out

cargo run --bin wrapper --release -- generate-snark-vk --input-binary {path to multiblock_batch.bin} --trusted-setup-file {path to setup.key} --output-dir out
```
The script will print out the verifier hash.