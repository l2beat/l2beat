Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM.
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
export NVM_DIR=$HOME/.nvm
. .bashrc
nvm install 20
npm install -g yarn
yarn set version 1.22.19

sudo apt-get update
sudo apt-get install -y build-essential pkg-config cmake clang lldb lld libssl-dev postgresql apt-transport-https ca-certificates curl software-properties-common
cargo install sqlx-cli --version 0.8.1

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
```

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

```
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
```

Reboot the machine to apply the drivers.

3. Install `foundryup-zksync`.

```
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
```

4. Build bellman-cuda. We used the tag version `prerelease-dev-a87a309`, commit hash `a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0`.
```
export CUDA_HOME=/usr/local/cuda
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda/lib64:/usr/local/cuda/extras/CUPTI/lib64
export PATH=$PATH:$CUDA_HOME/bin

git clone https://github.com/matter-labs/era-bellman-cuda.git
cd era-bellman-cuda
git checkout prerelease-dev-a87a309
git submodule update --init --recursive
cmake -B./build -DCMAKE_BUILD_TYPE=Release
cmake --build ./build
export BELLMAN_CUDA_DIR=$HOME/era-bellman-cuda
```

5. Run all scripts to regenerate verification keys. The correct commit hash is `f57999997f581b557cf8e36e3a9be5650d992022`.
```
cd ~
git clone https://github.com/matter-labs/zksync-era.git
cd zksync-era/
git checkout f57999997f581b557cf8e36e3a9be5650d992022

# Download compact CRS for the compressor data step, put in repo root
curl -o setup_compact.key https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_compact.key
export COMPACT_CRS_FILE=~/zksync-era/setup_compact.key

cd prover/crates/bin/vk_setup_data_generator_server_fri
CRS_FILE=https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_2^24.key ZKSYNC_HOME=$HOME

# Run regeneration steps
cargo run --release --bin key_generator generate-vk
cargo run --features gpu --release --bin key_generator generate-compressor-data
```

The output of the last command will contain the required `fflonk_snark_wrapper` value.