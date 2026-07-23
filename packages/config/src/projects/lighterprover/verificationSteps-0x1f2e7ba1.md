The verification process below is based on the `build_circuits.sh` [script](https://github.com/elliottech/lighter-prover/blob/23d1596b832db24f1007e20220ba1556d23b0c68/build_circuits.sh) in the lighter-prover repo. It consumed around 100 GiB of memory at the peak, so we recommend rerunning it on a machine with 128 GiB of RAM.

The steps below are for Ubuntu 22.04 OS.

1. Install rust, gcc, go version 1.21 and later.

```
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env

sudo apt update
sudo apt install build-essential

# one way to install latest go on Ubuntu 22.04
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -xvf go1.21.0.linux-amd64.tar.gz
sudo mv go /usr/local
export GOROOT=/usr/local/go
export GOPATH=$HOME/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
source ~/.profile
```

2. Run the correct version of the script to regenerate the keys.

```
git clone https://github.com/elliottech/lighter-prover.git
cd lighter-prover
git checkout 23d1596b832db24f1007e20220ba1556d23b0c68
chmod +x build_circuits.sh
./build_circuits.sh
```

The script will generate the `final::....sol` file that contains the verifier smart contract with the verification keys.
