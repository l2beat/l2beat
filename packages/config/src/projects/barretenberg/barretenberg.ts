import { ChainSpecificAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ZK_CATALOG_ATTESTERS } from '../../common/zkCatalogAttesters'
import { ZK_CATALOG_TAGS } from '../../common/zkCatalogTags'
import { TRUSTED_SETUPS } from '../../common/zkCatalogTrustedSetups'
import type { BaseProject } from '../../types'
import { readProjectMarkdown } from '../../utils/readMarkdown'

export const barretenberg: BaseProject = {
  id: ProjectId('barretenberg'),
  slug: 'barretenberg',
  name: 'Barretenberg',
  shortName: undefined,
  aliases: ['Aztec'],
  addedAt: UnixTime.fromDate(new Date('2026-03-17')),
  statuses: {
    yellowWarning: undefined,
    redWarning: undefined,
    emergencyWarning: undefined,
    reviewStatus: undefined,
    unverifiedContracts: [],
  },
  display: {
    description:
      'Barretenberg includes several zk-SNARK proof systems built by Aztec, including UltraHonk and CHONK.',
    links: {
      websites: ['https://aztec.network'],
      documentation: [
        'https://barretenberg.aztec.network/docs/',
        'https://eprint.iacr.org/2022/1355',
      ],
      repositories: [
        'https://github.com/AztecProtocol/aztec-packages/tree/next/barretenberg',
      ],
      socialMedia: ['https://x.com/aztecnetwork'],
    },
    badges: [],
  },
  zkCatalogInfo: {
    creator: 'Aztec',
    techStack: {
      zkVM: [
        ZK_CATALOG_TAGS.Plonk.UltraHonk,
        ZK_CATALOG_TAGS.Plonk.CHONK,
        ZK_CATALOG_TAGS.curve.BN254,
        ZK_CATALOG_TAGS.curve.Grumpkin,
        ZK_CATALOG_TAGS.ISA.AVM,
      ],
    },
    proofSystemInfo: readProjectMarkdown('barretenberg', 'proofSystemInfo'),
    trustedSetups: [
      {
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        ...TRUSTED_SETUPS.AztecIgnition,
      },
    ],
    projectsForTvs: [
      {
        projectId: ProjectId('aztecnetwork'),
        sinceTimestamp: UnixTime(1774821600), //  Monday, 30. March 2026 at 04:52, aztec launch according to Basti
      },
    ],
    verifierHashes: [
      {
        hash: '0x059ad02b037fcfd4df2b9db771777d067a400f06fc55cf45fa601511e58e2c3e',
        name: 'Barretenberg Aztec verifier v4',
        sourceLink:
          'https://github.com/AztecProtocol/aztec-packages/tree/v4/noir-projects/noir-protocol-circuits',
        proofSystem: ZK_CATALOG_TAGS.Plonk.UltraHonk,
        knownDeployments: [
          {
            address: ChainSpecificAddress.fromLong(
              'ethereum',
              '0x70aEDda427f26480D240bc0f4308ceDec8d31348',
            ),
          },
        ],
        verificationStatus: 'successful',
        attesters: [ZK_CATALOG_ATTESTERS.L2BEAT],
        verificationSteps: `
The regeneration process consumed 32 GiB memory on the peak. It could be done on macOS or Linux machines, however in our experience Linux setup was smoother. 
The steps below worked for clean Ubuntu 22.04.

1. Install necessary dependencies.

\`\`\`
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
sudo usermod -aG docker $\{USER\}

# Install rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
. .cargo/env
\`\`\`

2. Clone the repo and checkout the correct version
\`\`\`
git clone https://github.com/AztecProtocol/aztec-packages.git
cd aztec-packages
git checkout v4   # commit hash 408ff4d64fad09b8a11b0f54b56295271a113325
git submodule update --init --recursive
\`\`\`

3. Build preliminary components
\`\`\`
# build avm-transpiler binary
cd avm-transpiler
NO_CACHE=1 ./bootstrap.sh build_native

# build barretenberg binary
cd ../barretenberg/cpp
NO_CACHE=1 ./bootstrap.sh build_native

# build nargo binary
cd ../../noir
NO_CACHE=1 ./bootstrap.sh
\`\`\`

4. Remove the pinned build files and build the verifier smart contract:
\`\`\`
cd ../noir-projects/noir-protocol-circuits
rm pinned-build.tar.gz
corepack enable
NO_CACHE=1 ./bootstrap.sh
\`\`\`
The build should produce correct onchain verifier in \`target/keys/rollup_root_verifier.sol\`.
            `,
      },
    ],
  },
}
