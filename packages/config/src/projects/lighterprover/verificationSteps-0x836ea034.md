The verification process below is based on the `build_circuits.sh` [script](https://github.com/elliottech/lighter-prover/blob/8c01ea010d6fd46bdb77ef2f93a79278d1adf0df/build_circuits.sh) in the lighter-prover repository. It consumed around 100 GiB of memory at its peak, so we recommend rerunning it on a machine with 128 GiB of RAM.

The steps below are for Ubuntu 22.04.

1. Install Rust, GCC, and Go version 1.21 or later.

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt update
sudo apt install build-essential

# One way to install Go 1.21 on Ubuntu 22.04
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -xvf go1.21.0.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
source ~/.profile
```

2. Check out the `main` revision used for the verification and run the script to regenerate the keys.

```
git clone https://github.com/elliottech/lighter-prover.git
cd lighter-prover
git checkout 8c01ea010d6fd46bdb77ef2f93a79278d1adf0df
chmod +x build_circuits.sh
./build_circuits.sh
```

The script generates a `final::....sol` file containing the verifier smart contract and verification keys.
