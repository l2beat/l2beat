The regeneration process consumed 32 GiB memory on the peak. It could be done on macOS or Linux machines, however in our experience Linux setup was smoother. 
The steps below worked for clean Ubuntu 22.04.

1. Install necessary dependencies.

```
sudo apt-get install jq build-essential parallel ninja-build

# Install clang-format-20
wget https://apt.llvm.org/llvm.sh                                                                                                                                         
chmod +x llvm.sh                                                                                                                                                          
sudo ./llvm.sh 20                                                                                                                                                         
sudo apt-get install clang-format-20

# Install latest cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake

# Install zig 0.13.0
wget https://ziglang.org/download/0.13.0/zig-linux-x86_64-0.13.0.tar.xz                                                                                                   
tar xf zig-linux-x86_64-0.13.0.tar.xz                                                                                                                                     
sudo mv zig-linux-x86_64-0.13.0 /usr/local/zig                                                                                                                            
sudo ln -s /usr/local/zig/zig /usr/local/bin/zig

# Install yarn
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
npm install -g yarn

# Install gcc 13
sudo add-apt-repository ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get install g++-13

# Install docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker ${USER}

# Install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
```

2. Clone the repo and checkout the correct version
```
git clone https://github.com/AztecProtocol/aztec-packages.git
cd aztec-packages
git checkout v4   # commit hash 408ff4d64fad09b8a11b0f54b56295271a113325
git submodule update --init --recursive
```

3. Build preliminary components
```
# build avm-transpiler binary
cd avm-transpiler
NO_CACHE=1 ./bootstrap.sh build_native

# build barretenberg binary
cd ../barretenberg/cpp
NO_CACHE=1 ./bootstrap.sh build_native

# build nargo binary
cd ../../noir
NO_CACHE=1 ./bootstrap.sh
```

4. Remove the pinned build files and build the verifier smart contract:
```
cd ../noir-projects/noir-protocol-circuits
rm pinned-build.tar.gz
corepack enable
NO_CACHE=1 ./bootstrap.sh
```
The build should produce correct onchain verifier in `target/keys/rollup_root_verifier.sol`.
