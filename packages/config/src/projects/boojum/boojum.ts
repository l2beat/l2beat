import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'

export const boojum: BaseProject = {
  id: ProjectId('boojum'),
  slug: 'boojum',
  name: 'Boojum',
  shortName: undefined,
  addedAt: UnixTime.fromDate(new Date('2025-07-11')),
  display: {
    description:
      'Boojum is a zk proving system for EraVM programs built by Matter Labs to prove ZKsync Era state transition.',
    links: {
      documentation: [
        'https://matter-labs.github.io/zksync-era/core/latest/specs/prover/getting_started.html',
        'https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/14_zk_deeper_overview.html',
        'https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/15_prover_keys.html',
      ],
      repositories: ['https://github.com/matter-labs/era-boojum'],
    },
    badges: [],
  },
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  zkCatalogInfo: {
    creator: 'Matter Labs',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.STARK.Boojum,
        ZK_CATALOG_TAGS.ISA.EraVM,
        // ZK_CATALOG_TAGS.Arithmetization.Plonkish,
        ZK_CATALOG_TAGS.Field.Goldilocks,
      ],
      finalWrap: [
        ZK_CATALOG_TAGS.Plonk.Bellman,
        ZK_CATALOG_TAGS.Fflonk.Zksync,
        ZK_CATALOG_TAGS.curve.BN254,
        // ZK_CATALOG_TAGS.PCS.KZG,
      ],
    },
    proofSystemInfo: `
      ## Description

      Boojum is a proving system operating on [EraVM](https://matter-labs.github.io/zksync-era/core/latest/guides/advanced/12_alternative_vm_intro.html) ISA and supporting [zk stack](https://zkstack.io) chains. It includes recursive STARK proving of zkVM execution, as well as the final wrap with [Plonk](https://github.com/matter-labs/franklin-crypto/tree/dev/src/plonk) or [Fflonk](https://github.com/matter-labs/zksync-crypto/blob/main/crates/fflonk/docs/spec.pdf) SNARK proving system. Boojum targets [100 bits of security](https://github.com/matter-labs/era-boojum?tab=readme-ov-file#for-curions-in-benchmarks-only).

      ## Proof system

      ### zkVM component

      [Boojum](https://github.com/matter-labs/era-boojum/tree/main)'s core is an implementation of the [**Redshift**](https://eprint.iacr.org/2019/1400.pdf) protocol which uses the Plonk IOP with a polynomial commitment scheme based on List Polynomial Commitments (LPCs), which is in turn based on FRI, making the scheme transparent. The scheme makes use of the Goldilocks field, which is much smaller than BN254's field. This part of boojum implements a zkVM for EraVM, which is closely aligned with EVM but has essential differences like 16 registers.

      ### Recursion circuits

      The protocol makes use of several layers of recursive proof aggregation for 15 types of [circuits](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/recursion_layer/mod.rs#L29). In particular, node and scheduler circuits aggregate zk proofs and compressor and wrapper circuits reduce the final proof size. Further information about the aggregation architecture can be found [**here**](https://github.com/matter-labs/zksync-era/blob/1b61d0797062ab8b0aa2c1e92b23a3a0d8fd2c61/docs/guides/advanced/15_prover_keys.md#circuits).

      ### Final wrap

      The final proof could either be wrapped into a [Plonk](https://github.com/matter-labs/era-zkevm_test_harness/blob/3cd647aa57fc2e1180bab53f7a3b61ec47502a46/circuit_definitions/src/circuit_definitions/aux_layer/wrapper.rs)+KZG proof, or into [Fflonk](https://github.com/matter-labs/zksync-crypto/tree/main/crates/fflonk)+KZG for cheap verification. The KZG commitment is done over BN254 curve and it uses Aztec Ignition trusted setup ceremony, see [below](#trusted-setups) for more details.
      `,
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
      {
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('zklinknova'),
        sinceTimestamp: UnixTime(1709217961),
      },
      {
        projectId: ProjectId('zksync2'),
        sinceTimestamp: UnixTime(1689544800),
      },
      {
        projectId: ProjectId('abstract'),
        sinceTimestamp: UnixTime(1737932400),
      },
      {
        projectId: ProjectId('sophon'),
        sinceTimestamp: UnixTime(1734476400),
      },
      {
        projectId: ProjectId('cronoszkevm'),
        sinceTimestamp: UnixTime(1723672800),
      },
      {
        projectId: ProjectId('zeronetwork'),
        sinceTimestamp: UnixTime(1731366000),
      },
      {
        projectId: ProjectId('lens'),
        sinceTimestamp: UnixTime(1743717600),
      },
      {
        projectId: ProjectId('wonder'),
        sinceTimestamp: UnixTime(1746741600),
      },
      {
        projectId: ProjectId('zkcandy'),
        sinceTimestamp: UnixTime(1743976800),
      },
      {
        projectId: ProjectId('grvt'),
        sinceTimestamp: UnixTime(1734649200),
      },
      {
        projectId: ProjectId('lachain'),
        sinceTimestamp: UnixTime(1747692000),
      },
      {
        projectId: ProjectId('sxt'),
        sinceTimestamp: UnixTime(1746741600),
      },
    ],
    verifierHashes: [
      {
        hash: '0xe4503cf38485e3d728a7362155d53d3d63293e2fa48dca4f5588aa4625de251f',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xE3743181a4b0A0C1260826105c6BBA4b6e18D79d',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0xA14909eE4D20ebefd039094De75Fb440538799C1',
          //   ),
          //   chain: 'gateway',
          // },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM. 
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

\`\`\`
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

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker \${USER}

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
\`\`\`

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

\`\`\`
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
\`\`\`

Reboot the machine to apply the drivers.

3. Install \`foundryup-zksync\`.

\`\`\`
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
\`\`\`

4. Build bellman-cuda. We used the tag version \`prerelease-dev-a87a309\`, commit hash \`a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0\`.
\`\`\`
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
\`\`\`

5. Run all scripts to regenerate verification keys. The correct commit hash is \`f57999997f581b557cf8e36e3a9be5650d992022\`.
\`\`\`
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
\`\`\`

The output of the last command will contain the required \`fflonk_snark_wrapper\` value.
      `,
      },
      {
        hash: '0x6f36a08c517b060fa97308cdb3e23b04842ff839d451a753ec8fae1a5408304a',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x1AC4F629Fdc77A7700B68d03bF8D1A53f2210911',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0x3CFB3a80Af42cBE4d82C14301690A62D53e870a5',
          //   ),
          //   chain: 'zksync',
          // },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM. 
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

\`\`\`
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

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker \${USER}

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
\`\`\`

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

\`\`\`
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
\`\`\`

Reboot the machine to apply the drivers.

3. Install \`foundryup-zksync\`.

\`\`\`
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
\`\`\`

4. Build bellman-cuda. We used the tag version \`prerelease-dev-a87a309\`, commit hash \`a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0\`.
\`\`\`
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
\`\`\`

5. Run all scripts to regenerate verification keys. The correct tag version of the repo is \`core-v29.1.0\`, commit hash \`3b61f62b3361404c0c94635caee68c855ce2b9f8\`.
\`\`\`
cd ~ 
git clone https://github.com/matter-labs/zksync-era.git
cd zksync-era/
git checkout core-v29.1.0

# Download compact CRS for the compressor data step, put in repo root
curl -o setup_compact.key https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_compact.key
export COMPACT_CRS_FILE=~/zksync-era/setup_compact.key

cd prover/crates/bin/vk_setup_data_generator_server_fri
CRS_FILE=https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_2^24.key ZKSYNC_HOME=$HOME 

# Run regeneration steps
cargo run --release --bin key_generator generate-vk
cargo run --features gpu --release --bin key_generator generate-compressor-data
\`\`\`

The output of the last command will contain the required \`fflonk_snark_wrapper\` value.
                `,
      },
      // {
      //   hash: '0x17e8d7931f1314431359233e65c22657a32c335205e3c24ce292c5819becfaa7',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0xD5dBE903F5382B052317D326FA1a7B63710C6a5b',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0x941fd36f78a5ba753dbbe65b9123a43ae833405fafd03b5149b959eee766e03c',
      //   proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
      //   knownDeployments: [
      //     {
      //       address: '0x1F517f2bAb178AdD6e282297a4728bcc50E9F6CF',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      {
        hash: '0x93e83aa1ec05a2ac4de1f0b241394efb9f94a4e7c1784a5a9bf6b85eb930c62a',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xB3f4396C2040e502d0556Cbb16C0B22fE777A026',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0x7e81F6502209F1A114065A8f70820Ab5e28EE369',
          //   ),
          //   chain: 'gateway',
          // },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM. 
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

\`\`\`
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

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker \${USER}

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
\`\`\`

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

\`\`\`
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
\`\`\`

Reboot the machine to apply the drivers.

3. Install \`foundryup-zksync\`.

\`\`\`
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
\`\`\`

4. Build bellman-cuda. We used the tag version \`prerelease-dev-a87a309\`, commit hash \`a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0\`.
\`\`\`
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
\`\`\`

5. Run all scripts to regenerate verification keys. The correct commit hash is \`f57999997f581b557cf8e36e3a9be5650d992022\`.
\`\`\`
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
\`\`\`

The output of the last command will contain the required \`snark_wrapper\` value.
      `,
      },
      {
        hash: '0x64b347c642ea60114c98b3976124ea8a7e0bb778bd7e479aedc02f994486c8a1',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x2db2ffdecb7446aaab01FAc3f4D55863db3C5bd6',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0x92A9Fd0E84354213D9c3d33128eDd6Ea55ee0717',
          //   ),
          //   chain: 'zksync',
          // },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM. 
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

\`\`\`
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

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker \${USER}

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
\`\`\`

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

\`\`\`
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
\`\`\`

Reboot the machine to apply the drivers.

3. Install \`foundryup-zksync\`.

\`\`\`
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
\`\`\`

4. Build bellman-cuda. We used the tag version \`prerelease-dev-a87a309\`, commit hash \`a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0\`.
\`\`\`
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
\`\`\`

5. Run all scripts to regenerate verification keys. The correct tag version of the repo is \`prover-v22.0.0\`, commit hash \`157045b4f67546629fc2f7fb32cbbcb4daa2054d\`.
\`\`\`
cd ~ 
git clone https://github.com/matter-labs/zksync-era.git
cd zksync-era/
git checkout prover-v22.0.0

# Download compact CRS for the compressor data step, put in repo root
curl -o setup_compact.key https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_compact.key
export COMPACT_CRS_FILE=~/zksync-era/setup_compact.key

cd prover/crates/bin/vk_setup_data_generator_server_fri
CRS_FILE=https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_2^24.key ZKSYNC_HOME=$HOME 

# Run regeneration steps
cargo run --release --bin key_generator generate-vk
cargo run --features gpu --release --bin key_generator generate-compressor-data
\`\`\`

The output of the last command will contain the required \`snark_wrapper\` value.
                `,
      },
      // {
      //   hash: '0xd90459c5b727b9ceeb2b6192d2953dbf05970edf090333b3ad3bcac1a1442b78',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: EthereumAddress(
      //         '0x5BAfEF6729228add8775aF4Cecd2E68a51424Ee1',
      //       ),
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0xf688611ad4e0ef20184a89e7b593493dffcefe92071f85c1a0b94d4852c4f82f',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     {
      //       address: '0xAd36FFc4066855aeF3Bdf6BF03cA427bb084636e',
      //       chain: 'ethereum',
      //     },
      //   ],
      //   verificationStatus: 'notVerified',
      // },
      // {
      //   hash: '0x14f97b81e54b35fe673d8708cc1a19e1ea5b5e348e12d31e39824ed4f42bbca2',
      //   proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
      //   knownDeployments: [
      //     'https://etherscan.io/address/0xdb3300726556AFA413A11aF474a8cFDa4D7fc5a5',
      //   ],
      //   verificationStatus: 'notVerified',
      //   usedBy: [ProjectId('treasure')],
      // },
      {
        hash: '0x8574e152c41dc39a2ecab984545e1cf21cb3ec250b919018a8053f2fa270784f',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x902C3806A84f4e855a8746e92d7F1C9a51400458',
            ),
            chain: 'linea',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0x49eae0bf5c7ea580f4979b366e52b386adc5f42e2ce50fc1d3c4de9a86052bff',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xD324a7c8556A059371B207fB96FD77bE24E2042c',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0xD324a7c8556A059371B207fB96FD77bE24E2042c',
          //   ),
          //   chain: 'gateway',
          // },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM. 
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

\`\`\`
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

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker \${USER}

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
\`\`\`

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

\`\`\`
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
\`\`\`

Reboot the machine to apply the drivers.

3. Install \`foundryup-zksync\`.

\`\`\`
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
\`\`\`

4. Build bellman-cuda. We used the tag version \`prerelease-dev-a87a309\`, commit hash \`a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0\`.
\`\`\`
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
\`\`\`

5. Run all scripts to regenerate verification keys. The correct tag version of the repo is \`core-v29.4.0\`, commit hash \`fe0a73730853b291c3c1dd514a42a45625704b7b\`.
\`\`\`
cd ~ 
git clone https://github.com/matter-labs/zksync-era.git
cd zksync-era/
git checkout core-v29.4.0

# Download compact CRS for the compressor data step, put in repo root
curl -o setup_compact.key https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_compact.key
export COMPACT_CRS_FILE=~/zksync-era/setup_compact.key

cd prover/crates/bin/vk_setup_data_generator_server_fri
CRS_FILE=https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_2^24.key ZKSYNC_HOME=$HOME 

# Run regeneration steps
cargo run --release --bin key_generator generate-vk
cargo run --features gpu --release --bin key_generator generate-compressor-data
\`\`\`

The output of the last command will contain the required \`fflonk_snark_wrapper\` value.
                `,
      },
      {
        hash: '0x1ffc56111a5cfaf5db387f6a31408ad20217e9bc1f31f2f5c1bd38b0d6d7968b',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7',
            ),
            chain: 'ethereum',
          },
          // {
          //   address: EthereumAddress(
          //     '0xe201837d151E5aC33Af3305f287Ad6F6a7Dfccd7',
          //   ),
          //   chain: 'gateway',
          // },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
Verification requires an Ubuntu 22.04 machine with an NVIDIA GPU. We used a g6.4xlarge aws instance with 24 GiB GPU memory and 64 GiB RAM. 
The setup part is based on [this guide](https://paragraph.com/@zksync/from-integration-to-verification-completing-the-first-steps-in-zksync-s-prover-network) with modifications, the verification is done using [this script](https://github.com/matter-labs/zksync-era/tree/main/prover/crates/bin/vk_setup_data_generator_server_fri).

1. Install rust, yarn, some essential libraries, docker and cmake:

\`\`\`
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

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
sudo apt install -y docker-ce
sudo usermod -aG docker \${USER}

# install the latest version of cmake
sudo apt remove cmake
curl -fsSL https://apt.kitware.com/kitware-archive.sh | sudo sh
sudo apt-get install cmake
\`\`\`

2. Install CUDA drivers and toolkit 12.2, export necessary env vars. On Ubuntu 22.04 this requires updating gcc to version 12.

\`\`\`
sudo apt-get install gcc-12 g++-12
sudo update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-12 100
sudo update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-12 100

wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-drivers-535
sudo apt-get install -y cuda-toolkit-12-2
\`\`\`

Reboot the machine to apply the drivers.

3. Install \`foundryup-zksync\`.

\`\`\`
curl -L https://raw.githubusercontent.com/matter-labs/foundry-zksync/main/install-foundry-zksync | bash
. ~/.bashrc
foundryup-zksync
\`\`\`

4. Build bellman-cuda. We used the tag version \`prerelease-dev-a87a309\`, commit hash \`a87a309e7c07ef6b3fc5532e50d5d244aab9f4d0\`.
\`\`\`
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
\`\`\`

5. Run all scripts to regenerate verification keys. The correct tag version of the repo is \`prover-v23.2.0\`, commit hash \`2b188cd7ac139430d3cb1f27babc9693a2c83df6\`.
\`\`\`
cd ~ 
git clone https://github.com/matter-labs/zksync-era.git
cd zksync-era/
git checkout prover-v23.2.0

# Download compact CRS for the compressor data step, put in repo root
curl -o setup_compact.key https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_compact.key
export COMPACT_CRS_FILE=~/zksync-era/setup_compact.key

cd prover/crates/bin/vk_setup_data_generator_server_fri
CRS_FILE=https://storage.googleapis.com/matterlabs-setup-keys-us/setup-keys/setup_2^24.key ZKSYNC_HOME=$HOME 

# Run regeneration steps
cargo run --release --bin key_generator generate-vk
cargo run --features gpu --release --bin key_generator generate-compressor-data
\`\`\`

The output of the last command will contain the required \`snark_wrapper\` value.
        `,
      },
      {
        hash: '0xb2f50340e0edbe49dc657d4eb298e07f13860c1be0fe2e438e44ef8fad133d84',
        proofSystem: ZK_CATALOG_TAGS.Plonk.Bellman,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0x7f33D100f482093182111d69a4a457289e99f4ec',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
      },
      {
        hash: '0xc8cd705a0db89577146137de78eba6bd1f1c9c3f66dc52f7627e7c2df30895b2',
        proofSystem: ZK_CATALOG_TAGS.Fflonk.Zksync,
        knownDeployments: [
          {
            address: EthereumAddress(
              '0xa38a0Df579F9eCA29fbA560b9885B1113b1Df442',
            ),
            chain: 'ethereum',
          },
        ],
        verificationStatus: 'notVerified',
      },
    ],
  },
}
