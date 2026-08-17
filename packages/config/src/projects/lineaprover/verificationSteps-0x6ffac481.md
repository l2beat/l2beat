The regeneration process requires approximately 1 TiB of memory and approximately 400 GiB of disk space for trusted setup files and generated artifacts. It takes around 2 hours, excluding fetching 132 GiB of trusted setup assets.
We have verified the steps below on an Ubuntu machine.

1. Install build prerequisites: `build-essential` and the latest version of Go.
2. Optionally, set up additional swap RAM. We used:
```
sudo apt install zram-tools
vim /etc/default/zramswap   # set algo to zstd, % to 20 and priority to 100
sudo systemctl stop zramswap
sudo systemctl start zramswap
```
3. Check out tag `releases/prover/v1.0.5` (commit `477b0a4288fc54da185a992c47772c377d3ac1e9`) of [linea-monorepo](https://github.com/Consensys/linea-monorepo):
```
git clone https://github.com/Consensys/linea-monorepo.git
cd linea-monorepo
git checkout releases/prover/v1.0.5
```
4. Download trusted setup files (132 GiB) from the L2BEAT hosting server into the `prover/prover-assets/kzgsrs` dir:
```
cd prover/prover-assets/kzgsrs
wget -r -np -nH --cut-dirs=1 -R "index.html*" https://trusted-setup-hosting.l2beat.com/files/
```
5. Build the circuits and the verifier contract, this step takes several hours:
```
# from the linea-monorepo/prover dir
make setup
```
The generated verifier smart contract can be found in the `prover/prover-assets` directory, under the `emulation/Verifier.sol` subdirectory.
