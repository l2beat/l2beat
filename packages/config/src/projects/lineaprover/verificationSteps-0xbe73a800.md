The regeneration process requires approximately 1 TiB of memory and approximately 400 GiB of disk space for trusted setup files and generated artifacts. It takes around 2 hours, excluding fetching 132 GiB of trusted setup assets.
We have verified the steps below on an Ubuntu machine.

1. Install build prerequisites: `build-essential` and Go 1.25.7 or newer.
2. Optionally, set up additional swap RAM. We used:
```
sudo apt install zram-tools
vim /etc/default/zramswap   # set algo to zstd, % to 20 and priority to 100
sudo systemctl stop zramswap
sudo systemctl start zramswap
```
3. Check out tag `releases/prover/v1.0.6` (commit `064531156c8c4f52fa5f00f004a87677e4f90026`) of [linea-monorepo](https://github.com/Consensys/linea-monorepo):
```
git clone https://github.com/Consensys/linea-monorepo.git
cd linea-monorepo
git checkout releases/prover/v1.0.6
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
The generated verifier smart contract can be found in the `prover/prover-assets` directory, under the `7.0.1/emulation/Verifier.sol` subdirectory.
