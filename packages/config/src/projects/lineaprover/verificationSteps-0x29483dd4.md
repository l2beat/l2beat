The regeneration process requires approximately 1 TiB of memory and approximately 400 GiB of disk space for trusted setup files and generated artifacts. It takes around 2 hours, excluding fetching 132 GiB of trusted setup assets.
We have verified the steps below on an Ubuntu machine.

1. Install build prerequesits: `build-essential` and the latest version of go.
2. Optionally, set up additional swap RAM. We used:
```
sudo apt install zram-tools
vim /etc/default/zramswap   # set algo to zstd, % to 20 and priority to 100
sudo systemctl stop zramswap
sudo systemctl start zramswap
```
3. Check out the correct version of [linea-monorepo](https://github.com/Consensys/linea-monorepo):
```
git clone https://github.com/Consensys/linea-monorepo.git
cd linea-monorepo
git checkout b90a3c0b6735ba39dc19356628c09c03e42c016d
```
4. Download trusted setup files (132 GiB) from the L2BEAT hosting server into the `prover/prover-assets/kzgsrs` dir:
```
cd prover/prover-assets/kzgsrs
wget -r -np -nH --cut-dirs=1 -R "index.html*" https://trusted-setup-hosting.l2beat.com/files/
```
5. Build the circuits and the verifier contract, this step takes several hours:
```
# from the linea-monorepo/provers dir
make setup
```
The build artifacts will be places into `prover/prover-assets/6.2.1/` dir, the generated verifier smart contract could be found in `prover/prover-assets/6.2.1/emulation/Verifier.sol`.
